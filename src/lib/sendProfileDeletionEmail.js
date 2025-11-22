import axios from 'axios';

export async function sendProfileDeletionEmail({ to, candidateName }) {
  const subject = 'Your CareerCatalyst Profile Has Been Deleted';
  const body = `
    <p>Dear ${candidateName},</p>
    <p>Your CareerCatalyst account has been deleted as per your request. If this was not intended, please contact support immediately.</p>
    <p>Thank you for using CareerCatalyst.</p>
    <p>Best regards,<br/>CareerCatalyst Team</p>
  `;
  // Company and jobTitle are required by backend, but for deletion, we can use placeholders
  const company = 'CareerCatalyst';
  const jobTitle = 'Account Deletion';
  try {
    await axios.post('http://localhost:5000/send-candidate-email', {
      to,
      subject,
      body,
      company,
      jobTitle,
      candidateName,
    });
    return true;
  } catch (error) {
    console.error('Failed to send deletion email:', error);
    return false;
  }
}
