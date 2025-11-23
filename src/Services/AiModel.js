import { Gem } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyDkqBwAkKifGFxoF3SRjjoKHflXjZC_jHs";  // replace with your key
const genAI = new GoogleGenerativeAI(apiKey);

// Use a newer model, e.g. gemini-2.5-flash-lite
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1000,
};


export const AIChatSession = model.startChat({
  generationConfig,
  history: [],
});

/**
 * Generates a professional summary using Gemini AI model based on job title.
 * @param {string} jobTitle
 * @returns {Promise<string>} Professional summary
 */
export async function generateSummary(jobTitle) {
  if (!jobTitle || typeof jobTitle !== 'string') {
    throw new Error('Job title is required and must be a string.');
  }
  const prompt = `Generate a concise, professional summary for a resume based on the job title: "${jobTitle}". Limit to 3-4 sentences, highlight relevant skills and experience.`;
  try {
    const result = await model.generateContent(prompt);
    // Gemini returns result.candidates[0].content.parts[0].text
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text.trim();
  } catch (error) {
    console.error('AI summary generation failed:', error);
    throw new Error('Failed to generate summary.');
  }
}
