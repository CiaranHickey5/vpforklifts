import CryptoJS from 'crypto-js';

// Vite environment variables (use import.meta.env instead of process.env)
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'VirgilPowerForklifts2024SecureKey';

export const securityUtils = {
  /**
   * Hash password using SHA-256
   * @param {string} password - The password to hash
   * @returns {string} - The hashed password
   */
  hashPassword: (password) => {
    try {
      return CryptoJS.SHA256(password).toString();
    } catch (error) {
      console.error('Password hashing failed:', error);
      throw new Error('Authentication error');
    }
  },

  /**
   * Encrypt sensitive data for storage
   * @param {any} data - The data to encrypt
   * @returns {string|null} - The encrypted string or null if failed
   */
  encrypt: (data) => {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return null;
    }
  },

  /**
   * Decrypt sensitive data from storage
   * @param {string} encryptedData - The encrypted data
   * @returns {any|null} - The decrypted data or null if failed
   */
  decrypt: (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) {
        throw new Error('Decryption resulted in empty string');
      }
      
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  },

  /**
   * Generate secure session token
   * @returns {string} - A secure random token
   */
  generateSessionToken: () => {
    try {
      return CryptoJS.lib.WordArray.random(32).toString();
    } catch (error) {
      console.error('Token generation failed:', error);
      // Fallback to less secure but functional method
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
  },

  /**
   * Validate session token format
   * @param {string} token - The token to validate
   * @returns {boolean} - Whether the token is valid format
   */
  validateSessionToken: (token) => {
    return token && 
           typeof token === 'string' && 
           token.length >= 32 && 
           /^[a-f0-9]+$/i.test(token);
  },

  /**
   * Sanitize input to prevent XSS attacks
   * @param {string} input - The input to sanitize
   * @returns {string} - The sanitized input
   */
  sanitizeInput: (input) => {
    if (typeof input !== 'string') {
      return input;
    }
    
    return input
      // Remove script tags
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove javascript: protocols
      .replace(/javascript:/gi, '')
      // Remove on* event handlers
      .replace(/on\w+\s*=/gi, '')
      // Remove potential data: URIs with scripts
      .replace(/data:text\/html/gi, '')
      // Encode HTML brackets
      .replace(/[<>]/g, (match) => {
        return match === '<' ? '&lt;' : '&gt;';
      })
      // Remove null bytes
      .replace(/\0/g, '')
      // Limit length to prevent DoS
      .substring(0, 10000);
  },

  /**
   * Validate email format
   * @param {string} email - The email to validate
   * @returns {boolean} - Whether the email is valid
   */
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  /**
   * Validate phone number format
   * @param {string} phone - The phone to validate
   * @returns {boolean} - Whether the phone is valid
   */
  validatePhone: (phone) => {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone) && phone.length <= 20;
  },

  /**
   * Generate a secure hash for form tokens (CSRF protection)
   * @returns {string} - A secure form token
   */
  generateFormToken: () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return CryptoJS.SHA256(timestamp + random + ENCRYPTION_KEY).toString().substring(0, 32);
  },

  /**
   * Check if the environment is secure (HTTPS in production)
   * @returns {boolean} - Whether the environment is secure
   */
  isSecureEnvironment: () => {
    if (import.meta.env.DEV) {
      return true; // Allow HTTP in development
    }
    return window.location.protocol === 'https:';
  },

  /**
   * Log security events (for monitoring)
   * @param {string} event - The event type
   * @param {object} details - Event details
   */
  logSecurityEvent: (event, details = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // In production, you would send this to your security monitoring service
    if (import.meta.env.DEV) {
      console.log('Security Event:', logEntry);
    }

    // Store critical events locally for debugging
    if (['failed_login', 'account_locked', 'session_expired'].includes(event)) {
      try {
        const existingLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        existingLogs.push(logEntry);
        // Keep only last 50 entries
        const recentLogs = existingLogs.slice(-50);
        localStorage.setItem('security_logs', JSON.stringify(recentLogs));
      } catch (error) {
        console.error('Failed to log security event:', error);
      }
    }
  },

  /**
   * Clear sensitive data from memory (for logout)
   */
  clearSensitiveData: () => {
    // Clear any sensitive variables
    if (window.sensitiveData) {
      delete window.sensitiveData;
    }
    
    // Clear clipboard if it might contain sensitive data
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText('').catch(() => {
        // Ignore errors - clipboard clearing is best effort
      });
    }
  },

  /**
   * Check if user session should be extended based on activity
   * @param {number} lastActivity - Timestamp of last activity
   * @param {number} threshold - Activity threshold in milliseconds
   * @returns {boolean} - Whether session should be extended
   */
  shouldExtendSession: (lastActivity, threshold = 5 * 60 * 1000) => {
    return (Date.now() - lastActivity) < threshold;
  }
};