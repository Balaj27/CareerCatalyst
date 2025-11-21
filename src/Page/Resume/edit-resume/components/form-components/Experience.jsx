import React, { useEffect, useMemo } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import RichTextEditor from "../../../../../components/RichTextEditor";
import { useDispatch } from "react-redux";
import { addResumeData } from "../../../../../features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { updateThisResume } from "../../../../../Services/resumeAPI";
import { toast } from "sonner";

// Theme colors
const mainGreen = "linear-gradient(90deg, #16382C 0%, #225144 100%)";
const darkGreen = "#16382C";
const midGreen = "#225144";
const lightGreen = "#2D6F5B";
const white = "#fff";
const borderRadius = "16px";

const formFields = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  currentlyWorking: "",
  workSummary: "",
};

function Experience({ resumeInfo }) {
  const [experienceList, setExperienceList] = React.useState(
    resumeInfo?.experience || [formFields]
  );
  const [loading, setLoading] = React.useState(false);
  const { resumeId, resume_id } = useParams();
  const resolvedResumeId = resumeId || resume_id;
  const dispatch = useDispatch();

  // Validation: All required fields must be filled
  const isFormValid = useMemo(() => {
    return experienceList.every(
      (item) =>
        item.title?.trim() &&
        item.companyName?.trim() &&
        item.city?.trim() &&
        item.state?.trim() &&
        item.startDate?.trim() &&
        item.endDate?.trim()
    );
  }, [experienceList]);

  // Sync with Redux
  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, experience: experienceList }));
    // eslint-disable-next-line
  }, [experienceList]);

  const addExperience = () => {
    setExperienceList([...experienceList, { ...formFields }]);
  };

  const removeExperience = (index) => {
    const newList = experienceList.filter((_, i) => i !== index);
    setExperienceList(newList);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...experienceList];
    list[index] = { ...list[index], [name]: value };
    setExperienceList(list);
  };

  const handleRichTextEditor = (value, name, index) => {
    const list = [...experienceList];
    list[index] = { ...list[index], [name]: value };
    setExperienceList(list);
  };

  const onSave = async () => {
    if (!isFormValid) {
      toast("Please fill all required fields", { type: "error" });
      return;
    }

    if (!resolvedResumeId) {
      toast("No resume selected", { type: "error" });
      return;
    }

    setLoading(true);

    try {
      // Save the experience section inside the resume document
      await updateThisResume(resolvedResumeId, { experience: experienceList });
      toast("Experience saved", { type: "success" });
    } catch (error) {
      toast(error.message || "Failed to save experience", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          background: mainGreen,
          color: white,
          borderRadius,
          p: 3,
          mt: 3,
          boxShadow: "0 4px 12px rgba(22,56,44,0.12)",
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ color: white }}>
          Experience
        </Typography>
        <Typography variant="body2" sx={{ color: "#d0e7dd" }} gutterBottom>
          Add Your Previous Job Experience
        </Typography>

        {experienceList.map((experience, index) => (
          <Box key={index} mt={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
              spacing={2}
            >
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: white }}>
                Experience {index + 1}
              </Typography>
              <IconButton
                sx={{
                  color: "#f44336",
                  background: "#fff2",
                  borderRadius: "8px",
                  "&:hover": { background: "#fff4" },
                  ...(experienceList.length === 1 && { opacity: 0.5, pointerEvents: "none" }),
                }}
                onClick={() => removeExperience(index)}
                size="small"
                disabled={experienceList.length === 1}
              >
                <Delete />
              </IconButton>
            </Stack>

            <Box
              sx={{
                background: darkGreen,
                borderRadius: "12px",
                p: 3,
                boxShadow: "0 1px 6px rgba(22,56,44,0.08)",
                mb: 2,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Position Title"
                    value={experience.title}
                    onChange={(e) => handleChange(e, index)}
                    variant="filled"
                    size="small"
                    required
                    error={!experience.title}
                    helperText={!experience.title ? "Required" : ""}
                    sx={{
                      mb: 1,
                      "& .MuiFilledInput-root": {
                        background: midGreen,
                        color: white,
                        borderRadius: "8px",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#d0e7dd",
                      },
                    }}
                    InputLabelProps={{
                      style: { color: "#d0e7dd" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="companyName"
                    label="Company Name"
                    value={experience.companyName}
                    onChange={(e) => handleChange(e, index)}
                    variant="filled"
                    size="small"
                    required
                    error={!experience.companyName}
                    helperText={!experience.companyName ? "Required" : ""}
                    sx={{
                      mb: 1,
                      "& .MuiFilledInput-root": {
                        background: midGreen,
                        color: white,
                        borderRadius: "8px",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#d0e7dd",
                      },
                    }}
                    InputLabelProps={{
                      style: { color: "#d0e7dd" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="city"
                    label="City"
                    value={experience.city}
                    onChange={(e) => handleChange(e, index)}
                    variant="filled"
                    size="small"
                    required
                    error={!experience.city}
                    helperText={!experience.city ? "Required" : ""}
                    sx={{
                      mb: 1,
                      "& .MuiFilledInput-root": {
                        background: midGreen,
                        color: white,
                        borderRadius: "8px",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#d0e7dd",
                      },
                    }}
                    InputLabelProps={{
                      style: { color: "#d0e7dd" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="state"
                    label="State"
                    value={experience.state}
                    onChange={(e) => handleChange(e, index)}
                    variant="filled"
                    size="small"
                    required
                    error={!experience.state}
                    helperText={!experience.state ? "Required" : ""}
                    sx={{
                      mb: 1,
                      "& .MuiFilledInput-root": {
                        background: midGreen,
                        color: white,
                        borderRadius: "8px",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#d0e7dd",
                      },
                    }}
                    InputLabelProps={{
                      style: { color: "#d0e7dd" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    name="startDate"
                    label="Start Date"
                    value={experience.startDate}
                    onChange={(e) => handleChange(e, index)}
                    variant="filled"
                    size="small"
                    InputLabelProps={{ shrink: true, style: { color: "#d0e7dd" } }}
                    required
                    error={!experience.startDate}
                    helperText={!experience.startDate ? "Required" : ""}
                    sx={{
                      mb: 1,
                      "& .MuiFilledInput-root": {
                        background: midGreen,
                        color: white,
                        borderRadius: "8px",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#d0e7dd",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    name="endDate"
                    label="End Date"
                    value={experience.endDate}
                    onChange={(e) => handleChange(e, index)}
                    variant="filled"
                    size="small"
                    InputLabelProps={{ shrink: true, style: { color: "#d0e7dd" } }}
                    required
                    error={!experience.endDate}
                    helperText={!experience.endDate ? "Required" : ""}
                    sx={{
                      mb: 1,
                      "& .MuiFilledInput-root": {
                        background: midGreen,
                        color: white,
                        borderRadius: "8px",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#d0e7dd",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RichTextEditor
                    index={index}
                    defaultValue={experience?.workSummary}
                    onRichTextEditorChange={(event) =>
                      handleRichTextEditor(event, "workSummary", index)
                    }
                    resumeInfo={resumeInfo}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        ))}

        <Stack direction="row" justifyContent="space-between" py={2} gap={2}>
          <Button
            variant="outlined"
            sx={{
              borderColor: lightGreen,
              color: white,
              background: midGreen,
              borderRadius: "8px",
              "&:hover": { borderColor: white, background: lightGreen },
              fontWeight: 700,
              textTransform: "none",
            }}
            onClick={addExperience}
            startIcon={<Add />}
          >
            Add Experience
          </Button>
          <Button
            variant="contained"
            sx={{
              background: lightGreen,
              color: white,
              borderRadius: "8px",
              fontWeight: 700,
              px: 4,
              "&:hover": { background: midGreen },
              textTransform: "none",
            }}
            onClick={onSave}
            disabled={loading || !isFormValid}
            startIcon={loading ? <CircularProgress size={20} sx={{ color: white }} /> : null}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default Experience;