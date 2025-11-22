// generateProfessionalSummary.js
// Service to generate professional summary using AiModel

import { generateSummary } from './AiModel';

/**
 * Generates a professional summary based on job title.
 * @param {string} jobTitle - The job title entered by the user.
 * @returns {Promise<string>} - The generated professional summary.
 */
export async function generateProfessionalSummary(jobTitle) {
  if (!jobTitle || typeof jobTitle !== 'string') {
    throw new Error('Job title is required and must be a string.');
  }
  // Call the AI model to generate summary
  return await generateSummary(jobTitle);
}
