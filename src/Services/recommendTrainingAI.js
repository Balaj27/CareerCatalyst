import { AIChatSession } from "./AiModel";

export const getRecommendedTraining = async (skillsArray, jobTitle) => {
  const prompt = `
Given the user's job title: "${jobTitle}"
and skills: ${skillsArray.join(", ")}

Suggest 5 highly-relevant software development career paths for this user. For each path, provide:
- id: number (1-based index)
- title: string
- courses: array of 2-3 objects, each with:
    - platform: string
    - name: string
    - link: string (USE the **actual, current** URL to a real course on Coursera, Udemy, edX, LinkedIn Learning, or Pluralsight. NEVER use "#", always provide a real URL. Coursera template: https://www.coursera.org/specializations/(course name like google-ai))
    - description: string (1 sentence about the course)

Return only a valid JSON array and nothing else.
`
  const result = await AIChatSession.sendMessage(prompt);
  const text = await result.response.text();
  try {
    const cleaned = text.replace(/```(json)?/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse Gemini response:", text, e);
    return [];
  }
};