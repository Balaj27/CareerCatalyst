import { Gem } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBb-36n_Y9X7t7aApbfQLEZ4QJvI9vqUq0";  // replace with your key
const genAI = new GoogleGenerativeAI(apiKey);

// Use a newer model, e.g. gemini-2.5-flash-lite
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
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
