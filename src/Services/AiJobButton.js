import React, { useState } from "react";
import { Button, CircularProgress, Box } from "@mui/material";
import { Gem } from "lucide-react";
import { AIChatSession } from "./AiModel";

// Helper to check if required fields are filled
const areRequiredFieldsFilled = (jobData) =>
  jobData.title.trim() !== "" &&
  jobData.company.trim() !== "" &&
  jobData.jobType.trim() !== "" &&
  jobData.experience.trim() !== "";

const getPrompt = (jobData) => {
  return `
Act as a job description assistant. Given the following information:
Job Title: ${jobData.title}
Company Name: ${jobData.company}
Job Type: ${jobData.jobType}
Experience Level: ${jobData.experience}

Return a JSON object with these keys:
- description: a clean, readable job description (no Markdown or escaped characters, just clear text)
- requirements: a bullet-point list of job requirements as plain text in an array
- skills: a list of technical and soft skills as plain text in an array

Only return valid JSON. Example:
{
  "description": "A clear job description here.",
  "requirements": [
    "Requirement 1",
    "Requirement 2"
  ],
  "skills": [
    "Skill 1",
    "Skill 2"
  ]
}
`;
};

const AIJobAutoFillButton = ({ jobData, onAIFill }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const disabled = !areRequiredFieldsFilled(jobData);

  const handleGenerate = async () => {
    setError("");
    setLoading(true);

    try {
      const prompt = getPrompt(jobData);
      const result = await AIChatSession.sendMessage(prompt);

      // Get actual text from Gemini response
      let text = "";
      if (typeof result?.text === "function") {
        text = result.text();
      } else if (typeof result?.response?.text === "function") {
        text = result.response.text();
      } else {
        text =
          result?.response?.text ||
          result?.response ||
          result?.text ||
          "";
      }

      // Extract JSON from response
      let jsonString = text;
      // If Gemini wraps JSON in code block or text, extract
      const match = jsonString.match(/\{[\s\S]*\}/);
      if (match) jsonString = match[0];

      let aiData;
      try {
        aiData = JSON.parse(jsonString);
      } catch (e) {
        setError("AI response was not valid JSON. Please try again.");
        setLoading(false);
        return;
      }

      // Fill fields via callback
      onAIFill(aiData);
    } catch (err) {
      if (err?.response?.status === 429) {
        setError("AI generation rate limit reached. Please wait and try again.");
      } else {
        setError("AI generation failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Gem size={18} />}
        disabled={disabled || loading}
        onClick={handleGenerate}
      >
        {loading ? <CircularProgress size={18} /> : "Generate All Fields with AI"}
      </Button>
      {disabled && (
        <Box sx={{ color: "error.main", fontSize: 13, ml: 2 }}>
          Please fill Job Title, Company Name, Job Type, and Experience Level to activate AI.
        </Box>
      )}
      {error && (
        <Box sx={{ color: "error.main", fontSize: 13, ml: 2 }}>
          {error}
        </Box>
      )}
    </Box>
  );
};

export default AIJobAutoFillButton;