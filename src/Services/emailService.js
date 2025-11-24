import axios from 'axios';

const API_URL = process.env.REACT_APP_EMAIL_API_URL || 'http://localhost:5001';

/**
 * Send resume via email
 * @param {string} recipientEmail - Email address of the recipient
 * @param {string} senderName - Name of the person sending the resume
 * @param {string} message - Optional personal message
 * @param {string} pdfData - Base64 encoded PDF data
 * @param {string} filename - Name of the PDF file
 * @returns {Promise} API response
 */
export const sendResumeByEmail = async (recipientEmail, senderName, message, pdfData, filename) => {
  try {
    const response = await axios.post(`${API_URL}/send-resume-email`, {
      recipientEmail,
      senderName,
      message,
      pdfData,
      filename
    }, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error sending resume email:', error);
    
    if (error.response) {
      // Server responded with error
      return {
        success: false,
        error: error.response.data.error || 'Failed to send email',
        details: error.response.data
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        error: 'Email server is not responding. Please try again later.'
      };
    } else {
      // Other errors
      return {
        success: false,
        error: 'An error occurred while sending the email.'
      };
    }
  }
};

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
