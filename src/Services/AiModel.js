import { Gem } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyAB1vyPO0vT2Q22FwuhWRuVh0bR9MXVbhg";  // replace with your key
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
