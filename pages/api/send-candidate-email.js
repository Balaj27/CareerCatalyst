// pages/api/send-candidate-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, body, company, jobTitle, candidateName } = req.body;

  if (!to || !subject || !body || !company || !jobTitle || !candidateName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Configure your SMTP transport (use environment variables in production)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  const mailOptions = {
    from: `"${company} (CareerCatalyst)" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Message from ${company}</h2>
        <p><b>Job Applied:</b> ${jobTitle}</p>
        <p><b>Candidate:</b> ${candidateName}</p>
        <hr />
        <div>${body}</div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
