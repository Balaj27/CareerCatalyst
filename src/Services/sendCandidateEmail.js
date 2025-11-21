// src/Services/sendCandidateEmail.js
import axios from 'axios';

/**
 * Sends an email to the candidate using the backend email API.
 * @param {Object} params - The email parameters.
 * @param {string} params.to - Recipient email address.
 * @param {string} params.subject - Email subject.
 * @param {string} params.body - Email body (HTML or plain text).
 * @param {string} params.company - Company name.
 * @param {string} params.jobTitle - Job title applied for.
 * @param {string} params.candidateName - Candidate's name.
 * @returns {Promise}
 */
export async function sendCandidateEmail({ to, subject, body, company, jobTitle, candidateName }) {
  try {
    const response = await axios.post('http://localhost:5000/send-candidate-email', {
      to,
      subject,
      body,
      company,
      jobTitle,
      candidateName,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}
