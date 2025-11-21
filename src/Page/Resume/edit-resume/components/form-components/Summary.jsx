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
import { addResumeData } from "../../../../../features/resume/resumeFeatures";
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

const prompt = `Job Title: {jobTitle} , Depends on job title give me list of summary for 3 experience level, Mid Level and Fresher level in 3-4 lines in array format, With summary and experience_level Field in JSON Format`;

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
    dispatch(addResumeData({ ...resumeInfo, summary: value }));
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
    dispatch(addResumeData({ ...resumeInfo, summary: summaryText }));
  };

  const generateSummaryFromAI = async () => {
    setLoading(true);
    setAiGenerateSummaryList([]); // clear old state
    if (!resumeInfo?.personal?.jobTitle) {
      toast("Please Add Job Title", { type: "warning" });
      setLoading(false);
      return;
    }
    const PROMPT = prompt.replace("{jobTitle}", resumeInfo.personal.jobTitle);
    try {
      const result = await AIChatSession.sendMessage(PROMPT);

      let text =
        typeof result.response.text === "function"
          ? await result.response.text()
          : result.response.text;

      // Remove code blocks if present
      if (typeof text === "string") {
        text = text.replace(/```json|```/g, "").trim();
      }

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        toast("AI did not return a valid JSON.", { type: "warning" });
        setAiGenerateSummaryList([]);
        setLoading(false);
        return;
      }

      // Accepts either an array or an object with summaries array:
      if (Array.isArray(parsed)) {
        setAiGenerateSummaryList(parsed);
      } else if (parsed && Array.isArray(parsed.summaries)) {
        setAiGenerateSummaryList(parsed.summaries);
      } else if (parsed && parsed.summary && parsed.experience_level) {
        // Single summary object
        setAiGenerateSummaryList([parsed]);
      } else {
        setAiGenerateSummaryList([]);
        toast("AI did not return a valid summary list.", { type: "warning" });
      }
      toast("Summary Generated", { type: "success" });
    } catch (error) {
      console.error(error);
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