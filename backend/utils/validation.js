/**
 * Input validation and sanitization utilities
 */

/**
 * Sanitize input to prevent XSS and injection attacks
 * @param {string} input - The input to sanitize
 * @returns {string} - The sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== "string") {
    return input;
  }

  return (
    input
      // Remove script tags
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove javascript: protocols
      .replace(/javascript:/gi, "")
      // Remove on* event handlers
      .replace(/on\w+\s*=/gi, "")
      // Remove potential data: URIs with scripts
      .replace(/data:text\/html/gi, "")
      // Encode HTML brackets for display
      .replace(/[<>]/g, (match) => {
        return match === "<" ? "&lt;" : "&gt;";
      })
      // Remove null bytes
      .replace(/\0/g, "")
      // Trim whitespace
      .trim()
      // Limit length to prevent DoS
      .substring(0, 10000)
  );
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validate phone number format
 * @param {string} phone - The phone to validate
 * @returns {boolean} - Whether the phone is valid
 */
const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone) && phone.length <= 20;
};

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {object} - Validation result with isValid and message
 */
const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }

  if (password.length > 128) {
    return { isValid: false, message: "Password cannot exceed 128 characters" };
  }

  // Check for at least one letter and one number for stronger passwords
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      isValid: true, // Still valid but with warning
      message: "For better security, use both letters and numbers",
      isWeak: true,
    };
  }

  return { isValid: true, message: "Password is valid" };
};

/**
 * Validate SKU format
 * @param {string} sku - The SKU to validate
 * @returns {boolean} - Whether the SKU is valid
 */
const validateSKU = (sku) => {
  // SKU format: XXX-XXX-XXX (letters, numbers, hyphens, underscores)
  const skuRegex = /^[A-Z0-9\-_]{3,50}$/i;
  return skuRegex.test(sku);
};

/**
 * Validate price value
 * @param {number} price - The price to validate
 * @returns {object} - Validation result
 */
const validatePrice = (price) => {
  const numPrice = parseFloat(price);

  if (isNaN(numPrice)) {
    return { isValid: false, message: "Price must be a valid number" };
  }

  if (numPrice < 0) {
    return { isValid: false, message: "Price cannot be negative" };
  }

  if (numPrice > 1000000) {
    return { isValid: false, message: "Price cannot exceed €1,000,000" };
  }

  return { isValid: true, value: numPrice };
};

/**
 * Validate URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
const validateURL = (url) => {
  try {
    new URL(url);
    return url.startsWith("http://") || url.startsWith("https://");
  } catch {
    return false;
  }
};

/**
 * Validate MongoDB ObjectId format
 * @param {string} id - The ID to validate
 * @returns {boolean} - Whether the ID is valid
 */
const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validate and sanitize forklift data
 * @param {object} data - The forklift data to validate
 * @returns {object} - Validation result with errors array
 */
const validateForkliftData = (data) => {
  const errors = [];
  const sanitized = {};

  // Required fields validation
  const requiredFields = [
    "sku",
    "brand",
    "model",
    "type",
    "capacity",
    "lift",
    "price",
    "hirePrice",
    "description",
  ];

  requiredFields.forEach((field) => {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  });

  // SKU validation
  if (data.sku) {
    sanitized.sku = sanitizeInput(data.sku).toUpperCase();
    if (!validateSKU(sanitized.sku)) {
      errors.push(
        "SKU format is invalid (use letters, numbers, hyphens, underscores)"
      );
    }
  }

  // Brand validation
  const validBrands = [
    "Toyota",
    "Doosan",
    "Hyster",
    "Caterpillar",
    "Linde",
    "Still",
  ];
  if (data.brand) {
    sanitized.brand = sanitizeInput(data.brand);
    if (!validBrands.includes(sanitized.brand)) {
      errors.push(`Brand must be one of: ${validBrands.join(", ")}`);
    }
  }

  // Type validation
  const validTypes = ["Electric", "Diesel", "Gas", "Hybrid"];
  if (data.type) {
    sanitized.type = sanitizeInput(data.type);
    if (!validTypes.includes(sanitized.type)) {
      errors.push(`Type must be one of: ${validTypes.join(", ")}`);
    }
  }

  // Status validation
  const validStatuses = ["In Stock", "Coming Soon", "Sold", "On Hire"];
  if (data.status) {
    sanitized.status = sanitizeInput(data.status);
    if (!validStatuses.includes(sanitized.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(", ")}`);
    }
  }

  // String fields
  ["model", "capacity", "lift", "hirePrice", "description"].forEach((field) => {
    if (data[field]) {
      sanitized[field] = sanitizeInput(data[field]);

      // Length validation
      const maxLengths = {
        model: 200,
        capacity: 50,
        lift: 50,
        hirePrice: 50,
        description: 1000,
      };

      if (sanitized[field].length > maxLengths[field]) {
        errors.push(`${field} cannot exceed ${maxLengths[field]} characters`);
      }
    }
  });

  // Price validation
  if (data.price !== undefined) {
    const priceValidation = validatePrice(data.price);
    if (!priceValidation.isValid) {
      errors.push(priceValidation.message);
    } else {
      sanitized.price = priceValidation.value;
    }
  }

  // Image URL validation
  if (data.image) {
    sanitized.image = sanitizeInput(data.image);
    if (sanitized.image && !validateURL(sanitized.image)) {
      errors.push("Image must be a valid URL");
    }
  }

  // Features array validation
  if (data.features) {
    if (Array.isArray(data.features)) {
      sanitized.features = data.features
        .map((feature) => sanitizeInput(feature))
        .filter((feature) => feature.length > 0 && feature.length <= 100);

      if (sanitized.features.length > 20) {
        errors.push("Cannot have more than 20 features");
      }
    } else {
      errors.push("Features must be an array");
    }
  }

  // Specs object validation
  if (data.specs) {
    if (typeof data.specs === "object" && !Array.isArray(data.specs)) {
      sanitized.specs = {};
      let specCount = 0;

      for (let [key, value] of Object.entries(data.specs)) {
        if (specCount >= 20) {
          errors.push("Cannot have more than 20 specifications");
          break;
        }

        if (
          key &&
          value &&
          typeof key === "string" &&
          typeof value === "string"
        ) {
          const cleanKey = sanitizeInput(key);
          const cleanValue = sanitizeInput(value);

          if (cleanKey.length <= 50 && cleanValue.length <= 100) {
            sanitized.specs[cleanKey] = cleanValue;
            specCount++;
          }
        }
      }
    } else {
      errors.push("Specs must be an object");
    }
  }

  // Featured validation
  if (data.featured !== undefined) {
    sanitized.featured = Boolean(data.featured);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
};

/**
 * General input validation function
 * @param {object} data - Data to validate
 * @param {object} rules - Validation rules
 * @returns {object} - Validation result
 */
const validateInput = (data, rules) => {
  const errors = [];
  const sanitized = {};

  for (let [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];

    // Required field check
    if (
      fieldRules.required &&
      (!value || (typeof value === "string" && !value.trim()))
    ) {
      errors.push(`${field} is required`);
      continue;
    }

    // Skip further validation if field is not provided and not required
    if (!value && !fieldRules.required) {
      continue;
    }

    // Type validation
    if (fieldRules.type) {
      switch (fieldRules.type) {
        case "string":
          if (typeof value !== "string") {
            errors.push(`${field} must be a string`);
            continue;
          }
          sanitized[field] = sanitizeInput(value);
          break;

        case "number":
          const num = parseFloat(value);
          if (isNaN(num)) {
            errors.push(`${field} must be a valid number`);
            continue;
          }
          sanitized[field] = num;
          break;

        case "boolean":
          sanitized[field] = Boolean(value);
          break;

        case "email":
          if (!validateEmail(value)) {
            errors.push(`${field} must be a valid email`);
            continue;
          }
          sanitized[field] = value.toLowerCase().trim();
          break;

        case "url":
          if (!validateURL(value)) {
            errors.push(`${field} must be a valid URL`);
            continue;
          }
          sanitized[field] = value.trim();
          break;

        default:
          sanitized[field] = value;
      }
    } else {
      sanitized[field] = value;
    }

    // Length validation for strings
    if (
      fieldRules.minLength &&
      sanitized[field].length < fieldRules.minLength
    ) {
      errors.push(
        `${field} must be at least ${fieldRules.minLength} characters`
      );
    }

    if (
      fieldRules.maxLength &&
      sanitized[field].length > fieldRules.maxLength
    ) {
      errors.push(`${field} cannot exceed ${fieldRules.maxLength} characters`);
    }

    // Number range validation
    if (fieldRules.min && sanitized[field] < fieldRules.min) {
      errors.push(`${field} must be at least ${fieldRules.min}`);
    }

    if (fieldRules.max && sanitized[field] > fieldRules.max) {
      errors.push(`${field} cannot exceed ${fieldRules.max}`);
    }

    // Enum validation
    if (fieldRules.enum && !fieldRules.enum.includes(sanitized[field])) {
      errors.push(`${field} must be one of: ${fieldRules.enum.join(", ")}`);
    }

    // Custom validation function
    if (fieldRules.validate && typeof fieldRules.validate === "function") {
      const customResult = fieldRules.validate(sanitized[field]);
      if (customResult !== true) {
        errors.push(customResult || `${field} is invalid`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
};

module.exports = {
  sanitizeInput,
  validateEmail,
  validatePhone,
  validatePassword,
  validateSKU,
  validatePrice,
  validateURL,
  validateObjectId,
  validateForkliftData,
  validateInput,
};
