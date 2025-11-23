import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyDkqBwAkKifGFxoF3SRjjoKHflXjZC_jHs"; // Use your actual API key
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

/**
 * Generates a complete cover letter using Gemini AI model with user details.
 * @param {Object} params
 * @param {string} params.jobTitle - The job title
 * @param {string} params.company - The company name
 * @param {string} params.requirements - The job requirements
 * @param {string} params.skills - The user's skills (comma separated)
 * @param {string} params.experience - The user's experience summary
 * @param {string} params.name - The user's full name
 * @param {string} params.email - The user's email
 * @param {string} params.phone - The user's phone number
 * @returns {Promise<string>} Complete cover letter with user details
 */
export async function generateCoverLetterAI({ jobTitle, company, requirements, skills, experience, name, email, phone }) {
  if (!jobTitle || !company || !requirements) {
    throw new Error("Job title, company, and requirements are required.");
  }
  
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const userDetailsBlock = `${name || 'Applicant'}
${email || 'email@example.com'}
${phone || 'Phone Number'}
${dateStr}

${company}
Hiring Team

`;

  const prompt = `Write a professional, complete cover letter for a job application. Include all the details provided below and format it as a formal business letter.

Today's Date: ${dateStr}
Applicant Name: ${name || 'Not provided'}
Applicant Email: ${email || 'Not provided'}
Applicant Phone: ${phone || 'Not provided'}

Position: ${jobTitle}
Company: ${company}

Job Requirements:
${requirements}

Applicant's Skills:
${skills || 'Not provided'}

Applicant's Experience:
${experience || 'Not provided'}

Please write a complete, formal cover letter that:
1. Starts with the date, applicant's contact info, company name, and "Hiring Team"
2. Has a proper salutation (e.g., "Dear Hiring Team")
3. Opens with enthusiasm about the position
4. Highlights how the applicant's skills match the job requirements
5. Mentions relevant experience
6. Closes professionally with "Sincerely," and the applicant's name
7. Is ready to be printed and submitted as-is (no placeholders)

Return only the complete, formatted cover letter text. No additional commentary.`;

  console.log("[generateCoverLetterAI] Prompt:", prompt);
  
  try {
    console.log("[generateCoverLetterAI] Calling model.generateContent...");
    const result = await model.generateContent(prompt);
    console.log("[generateCoverLetterAI] Raw result:", result);
    console.log("[generateCoverLetterAI] Result keys:", Object.keys(result));
    
    // The result might have a 'response' property
    const candidates = result?.candidates || result?.response?.candidates;
    console.log("[generateCoverLetterAI] Candidates:", candidates);
    
    let text = candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("[generateCoverLetterAI] Extracted text type:", typeof text);
    console.log("[generateCoverLetterAI] Extracted text length:", text?.length);
    
    // If the response is JSON, parse it
    if (typeof text === 'string' && text.trim().startsWith('{')) {
      try {
        console.log("[generateCoverLetterAI] Attempting to parse as JSON...");
        const parsed = JSON.parse(text);
        console.log("[generateCoverLetterAI] Parsed JSON:", parsed);
        text = parsed.coverLetter || parsed.cover_letter || parsed.text || JSON.stringify(parsed);
        console.log("[generateCoverLetterAI] After JSON parsing, text:", text);
      } catch (e) {
        // If it's not valid JSON, use as is
        console.log("[generateCoverLetterAI] Not valid JSON, using raw text", e.message);
      }
    }
    
    const finalText = text.trim();
    console.log("[generateCoverLetterAI] Final cover letter length:", finalText.length);
    
    if (!finalText || finalText.length === 0) {
      console.warn("[generateCoverLetterAI] WARNING: Generated text is empty!");
    }
    
    return finalText;
  } catch (error) {
    console.error("AI cover letter generation failed:", error);
    console.error("Error details:", {
      message: error?.message,
      status: error?.status,
      stack: error?.stack
    });
    
    // Handle rate limit errors gracefully
    if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("RATE_LIMIT")) {
      throw new Error("API rate limit exceeded. Please wait a moment and try again.");
    }
    
    // Handle other errors
    if (error?.message?.includes("QUOTA")) {
      throw new Error("API quota exceeded. Please try again later or contact support.");
    }
    
    throw new Error("Failed to generate cover letter. Please try again.");
  }
}
