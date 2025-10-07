import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";
import { Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { setResumeData } from "../../../../../features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AIChatSession } from "../../../../../Services/AiModel";
import { updateThisResume } from "../../../../../Services/resumeAPI";

// Theme colors
const mainGreen = "linear-gradient(90deg, #16382C 0%, #225144 100%)";
const darkGreen = "#16382C";
const midGreen = "#225144";
const lightGreen = "#2D6F5B";
const white = "#fff";
const borderRadius = "16px";

const prompt = `Generate professional summaries for the job title: "{jobTitle}"

Create 3 different summaries for different experience levels:
1. Entry Level (0-2 years experience)
2. Mid Level (3-7 years experience) 
3. Senior Level (8+ years experience)

Each summary should be 3-4 lines and highlight relevant skills, achievements, and career focus for that experience level.

Return ONLY a valid JSON array in this exact format:
[
  {
    "summary": "Professional summary text here...",
    "experience_level": "Entry Level"
  },
  {
    "summary": "Professional summary text here...",
    "experience_level": "Mid Level"
  },
  {
    "summary": "Professional summary text here...",
    "experience_level": "Senior Level"
  }
]`;

function Summary({ resumeInfo }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(resumeInfo?.summary || "");
  const [aiGeneratedSummaryList, setAiGenerateSummaryList] = useState([]);
  const { resumeId, resume_id } = useParams();
  const resolvedResumeId = resumeId || resume_id;

  useEffect(() => {
    setSummary(resumeInfo?.summary || "");
  }, [resumeInfo?.summary]);

  const isFormValid = useMemo(() => summary.trim() !== "", [summary]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSummary(value);
    // Temporarily disable Redux updates to prevent infinite loop
    // TODO: Re-enable after fixing the loop issue
    // if (resumeInfo) {
    //   dispatch(setResumeData({ ...resumeInfo, summary: value }));
    // }
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast("Please add a summary", { type: "error" });
      return;
    }
    if (!resolvedResumeId) {
      toast("No resume selected", { type: "error" });
      return;
    }
    setLoading(true);
    try {
      await updateThisResume(resolvedResumeId, { summary });
      toast("Summary saved", { type: "success" });
    } catch (error) {
      toast("Error updating resume", { description: error.message || "Unknown error occurred" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const setSummery = (summaryText) => {
    setSummary(summaryText);
    // Temporarily disable Redux updates to prevent infinite loop
    // TODO: Re-enable after fixing the loop issue
    // if (resumeInfo) {
    //   dispatch(setResumeData({ ...resumeInfo, summary: summaryText }));
    // }
  };

  const generateSummaryFromAI = async () => {
    setLoading(true);
    setAiGenerateSummaryList([]); // clear old state
    
    const jobTitle = resumeInfo?.personal?.jobTitle || resumeInfo?.jobTitle;
    if (!jobTitle) {
      toast("Please Add Job Title", { type: "warning" });
      setLoading(false);
      return;
    }
    
    const PROMPT = prompt.replace("{jobTitle}", jobTitle);
    try {
      const result = await AIChatSession.sendMessage(PROMPT);

      let text = "";
      if (typeof result?.response?.text === "function") {
        text = await result.response.text();
      } else if (typeof result?.response?.text === "string") {
        text = result.response.text;
      } else if (typeof result?.text === "function") {
        text = await result.text();
      } else if (typeof result?.text === "string") {
        text = result.text;
      } else {
        text = result?.response || result || "";
      }

      console.log("AI Response:", text); // Debug log

      // Clean the response
      if (typeof text === "string") {
        // Remove markdown code blocks
        text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        
        // Extract JSON from response if wrapped in other text
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          text = jsonMatch[0];
        }
      }

      let parsed;
      try {
        parsed = JSON.parse(text);
        console.log("Parsed AI Response:", parsed); // Debug log
      } catch (err) {
        console.error("JSON Parse Error:", err, "Text:", text);
        toast("AI did not return valid JSON. Please try again.", { type: "warning" });
        setAiGenerateSummaryList([]);
        setLoading(false);
        return;
      }

      // Handle different response formats
      if (Array.isArray(parsed)) {
        setAiGenerateSummaryList(parsed);
        toast("Summary Generated Successfully", { type: "success" });
      } else if (parsed && Array.isArray(parsed.summaries)) {
        setAiGenerateSummaryList(parsed.summaries);
        toast("Summary Generated Successfully", { type: "success" });
      } else if (parsed && parsed.summary && parsed.experience_level) {
        // Single summary object
        setAiGenerateSummaryList([parsed]);
        toast("Summary Generated Successfully", { type: "success" });
      } else {
        setAiGenerateSummaryList([]);
        toast("AI did not return a valid summary format.", { type: "warning" });
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast("Failed to generate summary", {
        description: error.message || "Error processing AI response",
      });
      setAiGenerateSummaryList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={2}>
      <Box
        sx={{
          background: mainGreen,
          borderRadius,
          p: 3,
          color: white,
          boxShadow: "0 4px 12px rgba(22,56,44,0.12)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={0.5}
          sx={{ color: white, letterSpacing: 0.3 }}
        >
          Summary
        </Typography>
        <Typography variant="body2" sx={{ color: "#d0e7dd" }} mb={2}>
          Add a summary for your job title
        </Typography>

        <form onSubmit={onSave}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
            flexWrap="wrap"
            gap={1}
          >
            <Typography variant="subtitle2" sx={{ color: "#c4e2d7" }}>
              Add Summary
            </Typography>
            <Button
              variant="contained"
              sx={{
                background: lightGreen,
                color: white,
                borderRadius: "8px",
                fontWeight: 600,
                "&:hover": { background: midGreen },
                textTransform: "none",
                px: 2,
                py: 0.8,
                minHeight: 0,
              }}
              onClick={generateSummaryFromAI}
              startIcon={<Sparkles size={18} />}
              disabled={loading}
              size="small"
              type="button"
            >
              Generate from AI
            </Button>
          </Stack>

          <TextField
            name="summary"
            multiline
            fullWidth
            minRows={4}
            required
            value={summary}
            onChange={handleInputChange}
            variant="filled"
            sx={{
              mb: 2,
              borderRadius: "8px",
              "& .MuiFilledInput-root": {
                background: midGreen,
                color: white,
                borderRadius: "8px",
              },
              "& .MuiInputLabel-root": {
                color: "#d0e7dd",
              },
            }}
            error={summary.trim() === ""}
            helperText={summary.trim() === "" ? "Summary is required" : ""}
            InputProps={{
              style: {
                background: midGreen,
                color: white,
                borderRadius: "8px",
              },
            }}
            InputLabelProps={{
              style: { color: "#d0e7dd" },
            }}
          />

          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: lightGreen,
                color: white,
                borderRadius: "8px",
                px: 4,
                fontWeight: 700,
                "&:hover": { background: midGreen },
                textTransform: "none",
                minHeight: 0,
              }}
              disabled={loading || !isFormValid}
              startIcon={loading ? <CircularProgress size={20} sx={{ color: white }} /> : null}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </form>
      </Box>

      {aiGeneratedSummaryList && aiGeneratedSummaryList.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6" fontWeight="bold" mb={1} sx={{ color: darkGreen }}>
            AI Suggestions
          </Typography>
          <Stack spacing={2}>
            {aiGeneratedSummaryList.map((item, index) => (
              <Paper
                key={index}
                onClick={() => setSummery(item.summary)}
                sx={{
                  cursor: "pointer",
                  p: 2,
                  borderLeft: `5px solid ${midGreen}`,
                  background: "#f8faf9",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(22,56,44,0.08)",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(22,56,44,0.13)",
                    borderLeft: `7px solid ${lightGreen}`,
                  },
                }}
              >
                <Typography variant="subtitle2" color="primary">
                  Level: {item.experience_level || item.experience || "N/A"}
                </Typography>
                <Typography color={darkGreen}>
                  {item.summary || JSON.stringify(item)}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default Summary;