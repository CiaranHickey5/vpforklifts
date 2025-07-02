const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Check if Resend API key is available
let resend = null;
if (process.env.RESEND_API_KEY) {
  const { Resend } = require('resend');
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log('✅ Resend configured successfully');
} else {
  console.error('❌ RESEND_API_KEY not found in environment variables');
  console.error('📝 Please add RESEND_API_KEY to your Render environment variables');
}

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 submissions per 15 minutes per IP
  message: {
    success: false,
    message: 'Too many contact form submissions. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone format (Irish numbers)
const isValidPhone = (phone) => {
  const phoneRegex = /^(\+353|0)?[1-9][0-9]{7,9}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
    .substring(0, 1000); // Limit length
};

// Contact form submission
router.post('/submit', contactLimiter, async (req, res) => {
  try {
    console.log('📨 Contact form submission received:', req.body);

    // Check if Resend is configured
    if (!resend) {
      console.error('❌ Resend not configured - missing API key');
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured. Please try calling us directly at +353 51 293 208.'
      });
    }

    const { name, phone, email, service, message } = req.body;

    // Validation
    const errors = [];

    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!phone || !isValidPhone(phone)) {
      errors.push('Please provide a valid Irish phone number');
    }

    if (!email || !isValidEmail(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!message || message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }

    if (errors.length > 0) {
      console.log('❌ Validation errors:', errors);
      return res.status(400).json({
        success: false,
        message: 'Please fix the following errors:',
        errors
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      phone: sanitizeInput(phone),
      email: sanitizeInput(email),
      service: sanitizeInput(service),
      message: sanitizeInput(message)
    };

    console.log('✅ Data validated and sanitized');

    // Create beautiful HTML email
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New Contact Form Submission</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #f5f5f5;
    }
    .container { background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { 
      background: linear-gradient(135deg, #1976d2 0%, #ff8c00 100%); 
      color: white; 
      padding: 30px; 
      text-align: center; 
    }
    .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
    .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
    .content { padding: 30px; }
    .section-title { color: #1976d2; font-size: 20px; font-weight: 600; margin-bottom: 20px; border-bottom: 2px solid #e3f2fd; padding-bottom: 10px; }
    .detail-card { 
      margin: 15px 0; 
      padding: 20px; 
      background: linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%); 
      border-left: 4px solid #ff8c00; 
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .label { 
      font-weight: 600; 
      color: #1976d2; 
      display: block; 
      margin-bottom: 8px; 
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .value { 
      color: #333; 
      font-size: 16px;
      font-weight: 500;
    }
    .message-box { 
      background: linear-gradient(135deg, #fff8e1 0%, #ffffff 100%); 
      padding: 25px; 
      border: 1px solid #ffcc02; 
      border-radius: 12px; 
      margin: 25px 0;
      box-shadow: 0 2px 12px rgba(255, 140, 0, 0.1);
    }
    .message-text {
      margin: 0;
      line-height: 1.7;
      font-size: 16px;
      color: #444;
    }
    .footer { 
      padding: 25px; 
      text-align: center; 
      background: #f8f9fa; 
      border-top: 1px solid #e9ecef;
    }
    .footer p { margin: 5px 0; color: #666; font-size: 14px; }
    .timestamp { font-weight: 600; color: #1976d2; }
    a { color: #1976d2; text-decoration: none; font-weight: 500; }
    a:hover { text-decoration: underline; }
    .cta-button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(45deg, #1976d2, #2196f3);
      color: white !important;
      text-decoration: none;
      border-radius: 25px;
      font-weight: 600;
      margin: 10px 5px;
      transition: transform 0.2s;
    }
    .cta-button:hover { transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚜 New Contact Inquiry!</h1>
      <p>Virgil Power Forklifts Website</p>
    </div>
    
    <div class="content">
      <div class="section-title">📋 Customer Details</div>
      
      <div class="detail-card">
        <span class="label">👤 Customer Name</span>
        <div class="value">${sanitizedData.name}</div>
      </div>
      
      <div class="detail-card">
        <span class="label">📞 Phone Number</span>
        <div class="value">
          <a href="tel:${sanitizedData.phone}" class="cta-button">📱 Call ${sanitizedData.phone}</a>
        </div>
      </div>
      
      <div class="detail-card">
        <span class="label">📧 Email Address</span>
        <div class="value">
          <a href="mailto:${sanitizedData.email}" class="cta-button">✉️ Reply to ${sanitizedData.email}</a>
        </div>
      </div>
      
      <div class="detail-card">
        <span class="label">🔧 Service Interested In</span>
        <div class="value">${sanitizedData.service || 'General Inquiry'}</div>
      </div>
      
      <div class="section-title">💬 Customer Message</div>
      <div class="message-box">
        <p class="message-text">${sanitizedData.message.replace(/\n/g, '<br>')}</p>
      </div>
    </div>
    
    <div class="footer">
      <p class="timestamp">📅 Submitted: ${new Date().toLocaleString('en-IE', { 
        timeZone: 'Europe/Dublin',
        dateStyle: 'full',
        timeStyle: 'short'
      })}</p>
      <p>💡 <strong>Quick Response Tip:</strong> Reply directly to this email to contact the customer</p>
      <p style="color: #999; font-size: 12px;">This inquiry was submitted through the Virgil Power Forklifts website contact form</p>
    </div>
  </div>
</body>
</html>
    `;

    // Send notification email to you
    console.log('📧 Sending notification email to ciaran.hickey99@gmail.com');
    
    const adminEmailResult = await resend.emails.send({
      from: 'Virgil Power Forklifts <contact@virgilpowerforklifts.com>',
      to: 'ciaran.hickey99@gmail.com',
      replyTo: sanitizedData.email,
      subject: `🚜 NEW ${sanitizedData.service || 'INQUIRY'} from ${sanitizedData.name} - Action Required`,
      html: adminEmailHtml
    });

    console.log('✅ Admin notification sent successfully:', adminEmailResult.data?.id);

    // Create customer auto-reply
    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Thank You - Virgil Power Forklifts</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #f5f5f5;
    }
    .container { background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { 
      background: linear-gradient(135deg, #1976d2 0%, #ff8c00 100%); 
      color: white; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .header h1 { margin: 0; font-size: 32px; font-weight: 700; }
    .header p { margin: 15px 0 0 0; opacity: 0.95; font-size: 18px; }
    .content { padding: 40px 30px; }
    .thank-you { text-align: center; margin-bottom: 30px; }
    .thank-you h2 { color: #1976d2; margin-bottom: 15px; font-size: 24px; }
    .highlight-box { 
      background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%); 
      padding: 25px; 
      border-left: 4px solid #1976d2; 
      margin: 25px 0; 
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(25, 118, 210, 0.1);
    }
    .contact-box { 
      background: linear-gradient(135deg, #fff8e1 0%, #ffffff 100%); 
      padding: 25px; 
      border-left: 4px solid #ff8c00; 
      margin: 25px 0; 
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(255, 140, 0, 0.1);
    }
    .contact-box h3 { color: #ff8c00; margin-top: 0; }
    .footer { 
      padding: 30px; 
      text-align: center; 
      background: #f8f9fa; 
      border-top: 1px solid #e9ecef;
    }
    a { color: #1976d2; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
    .phone-button {
      display: inline-block;
      padding: 12px 20px;
      background: linear-gradient(45deg, #ff8c00, #ffb74d);
      color: white !important;
      text-decoration: none;
      border-radius: 25px;
      font-weight: 600;
      margin: 8px;
      transition: transform 0.2s;
    }
    .phone-button:hover { transform: translateY(-2px); }
    .summary-item { margin: 10px 0; }
    .summary-label { font-weight: 600; color: #1976d2; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Thank You!</h1>
      <p>We've received your inquiry</p>
    </div>
    
    <div class="content">
      <div class="thank-you">
        <h2>Dear ${sanitizedData.name},</h2>
        <p>Thank you for contacting <strong>Virgil Power Forklifts</strong>! We've received your inquiry and our team will respond <strong>within 2 hours</strong> during business hours.</p>
      </div>
      
      <div class="highlight-box">
        <h3>✅ Your Inquiry Summary</h3>
        <div class="summary-item">
          <span class="summary-label">Service:</span> ${sanitizedData.service || 'General Inquiry'}
        </div>
        <div class="summary-item">
          <span class="summary-label">Your Contact:</span> ${sanitizedData.phone}
        </div>
        <div class="summary-item">
          <span class="summary-label">Reference:</span> #${Date.now().toString().slice(-6)}
        </div>
      </div>
      
      <div class="contact-box">
        <h3>📞 Need Immediate Assistance?</h3>
        <p>For urgent matters or immediate support:</p>
        <div style="text-align: center;">
          <a href="tel:+35351293208" class="phone-button">📞 Main Office: +353 51 293 208</a>
          <a href="tel:+353872501934" class="phone-button">🚨 Emergency: +353 87 250 1934</a>
        </div>
        <p style="text-align: center; margin-top: 15px;">
          <em>Available 7 days a week for emergency breakdowns</em>
        </p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
        <p><strong>What happens next?</strong></p>
        <p>Our forklift specialists will review your requirements and contact you with a personalized solution. We pride ourselves on quick response times and competitive pricing.</p>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Virgil Power Forklifts</strong></p>
      <p>📧 <a href="mailto:sales@virgilpowerforklifts.com">sales@virgilpowerforklifts.com</a></p>
      <p>🌐 Serving all of Ireland with quality forklift solutions</p>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        This is an automated confirmation email. Please do not reply to this message.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Send auto-reply to customer
    try {
      console.log('📧 Sending auto-reply to customer:', sanitizedData.email);
      
      await resend.emails.send({
        from: 'Virgil Power Forklifts <noreply@virgilpowerforklifts.com>',
        to: sanitizedData.email,
        subject: '🚜 Thank you for contacting Virgil Power Forklifts - We\'ll be in touch within 2 hours!',
        html: customerEmailHtml
      });
      
      console.log('✅ Customer auto-reply sent successfully');
    } catch (autoReplyError) {
      console.error('⚠️ Auto-reply failed (continuing anyway):', autoReplyError.message);
    }

    // Success response
    res.status(200).json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 2 hours during business hours.'
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    // Check if it's a Resend-specific error
    if (error.name === 'ResendError') {
      console.error('Resend API Error:', error.message);
    }
    
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again or call us directly at +353 51 293 208.'
    });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Contact service unhealthy - RESEND_API_KEY not configured',
        resend: 'not configured'
      });
    }
    
    res.json({
      success: true,
      message: 'Contact service is healthy',
      timestamp: new Date().toISOString(),
      resend: 'configured'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Contact service unhealthy',
      error: error.message
    });
  }
});

module.exports = router;