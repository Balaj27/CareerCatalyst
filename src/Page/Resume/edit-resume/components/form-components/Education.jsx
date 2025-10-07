import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setResumeData } from "../../../../../features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { updateThisResume } from "../../../../../Services/resumeAPI";
import { toast } from "sonner";

// THEME COLORS
const mainGreen = "linear-gradient(90deg, #16382C 0%, #225144 100%)";
const darkGreen = "#16382C";
const midGreen = "#225144";
const lightGreen = "#2D6F5B";
const white = "#fff";
const borderRadius = "16px";

const formFields = {
  universityName: "",
  degree: "",
  major: "",
  grade: "",
  gradeType: "CGPA",
  startDate: "",
  endDate: "",
  description: "",
};

function Education({ resumeInfo }) {
  const [educationList, setEducationList] = useState(
    resumeInfo?.education && resumeInfo.education.length > 0 ? resumeInfo.education : [formFields]
  );
  const [loading, setLoading] = useState(false);
  const { resumeId, resume_id } = useParams();
  const resolvedResumeId = resumeId || resume_id;
  const dispatch = useDispatch();

  // Validation: All required fields must be filled
  const isFormValid = useMemo(() => {
    return educationList.every(
      (item) =>
        item.universityName?.trim() &&
        item.degree?.trim() &&
        item.major?.trim() &&
        item.grade?.trim() &&
        item.startDate?.trim() &&
        item.endDate?.trim()
    );
  }, [educationList]);

  useEffect(() => {
    setEducationList(
      resumeInfo?.education && resumeInfo.education.length > 0
        ? resumeInfo.education
        : [formFields]
    );
  }, [resumeInfo?.education]);

  // Temporarily disable Redux updates to prevent infinite loop
  // TODO: Re-enable after fixing the loop issue
  // useEffect(() => {
  //   if (resumeInfo && educationList) {
  //     dispatch(setResumeData({ ...resumeInfo, education: educationList }));
  //   }
  // }, [educationList, dispatch]);

  const addEducation = () => {
    setEducationList([...educationList, { ...formFields }]);
  };

  const removeEducation = (index) => {
    const newList = educationList.filter((_, i) => i !== index);
    setEducationList(newList);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...educationList];
    list[index] = { ...list[index], [name]: value };
    setEducationList(list);
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
      await updateThisResume(resolvedResumeId, { education: educationList });
      toast("Education saved", { type: "success" });
    } catch (error) {
      toast(error.message || "Failed to save education", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
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
        Education
      </Typography>
      <Typography variant="body2" sx={{ color: "#d0e7dd" }}>
        Add your educational details
      </Typography>

      {educationList.map((item, index) => (
        <Box key={index} mt={3}
          sx={{
            background: darkGreen,
            borderRadius: "12px",
            p: 3,
            boxShadow: "0 1px 6px rgba(22,56,44,0.08)",
            mb: 2,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
            spacing={2}
          >
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: white }}>
              Education {index + 1}
            </Typography>
            <IconButton
              sx={{
                color: "#f44336",
                background: "#fff2",
                borderRadius: "8px",
                "&:hover": { background: "#fff4" },
                ...(educationList.length === 1 && { opacity: 0.5, pointerEvents: "none" }),
              }}
              onClick={() => removeEducation(index)}
              size="small"
              disabled={educationList.length === 1}
            >
              <Delete />
            </IconButton>
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="University Name"
                name="universityName"
                value={item.universityName}
                onChange={(e) => handleChange(e, index)}
                variant="filled"
                size="small"
                required
                error={!item.universityName}
                helperText={!item.universityName ? "Required" : ""}
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Degree"
                name="degree"
                value={item.degree}
                onChange={(e) => handleChange(e, index)}
                variant="filled"
                size="small"
                required
                error={!item.degree}
                helperText={!item.degree ? "Required" : ""}
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Major"
                name="major"
                value={item.major}
                onChange={(e) => handleChange(e, index)}
                variant="filled"
                size="small"
                required
                error={!item.major}
                helperText={!item.major ? "Required" : ""}
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={item.startDate}
                onChange={(e) => handleChange(e, index)}
                InputLabelProps={{ shrink: true, style: { color: "#d0e7dd" } }}
                variant="filled"
                size="small"
                required
                error={!item.startDate}
                helperText={!item.startDate ? "Required" : ""}
                InputProps={{
                  style: {
                    background: midGreen,
                    color: white,
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={item.endDate}
                onChange={(e) => handleChange(e, index)}
                InputLabelProps={{ shrink: true, style: { color: "#d0e7dd" } }}
                variant="filled"
                size="small"
                required
                error={!item.endDate}
                helperText={!item.endDate ? "Required" : ""}
                InputProps={{
                  style: {
                    background: midGreen,
                    color: white,
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom sx={{ color: "#d0e7dd" }}>Grade</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel id={`grade-type-label-${index}`} sx={{ color: "#d0e7dd" }}>Type</InputLabel>
                  <Select
                    labelId={`grade-type-label-${index}`}
                    name="gradeType"
                    value={item.gradeType}
                    label="Type"
                    onChange={(e) => handleChange(e, index)}
                    sx={{
                      color: white,
                      background: midGreen,
                      borderRadius: "8px",
                      ".MuiSelect-icon": { color: "#d0e7dd" },
                    }}
                  >
                    <MenuItem value="CGPA">CGPA</MenuItem>
                    <MenuItem value="GPA">GPA</MenuItem>
                    <MenuItem value="Percentage">Percentage</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Grade Value"
                  name="grade"
                  value={item.grade}
                  onChange={(e) => handleChange(e, index)}
                  variant="filled"
                  size="small"
                  required
                  error={!item.grade}
                  helperText={!item.grade ? "Required" : ""}
                  sx={{
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
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={item.description}
                onChange={(e) => handleChange(e, index)}
                variant="filled"
                size="small"
                sx={{
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
          </Grid>
        </Box>
      ))}

      <Stack direction="row" justifyContent="space-between" mt={3}>
        <Button
          variant="outlined"
          onClick={addEducation}
          startIcon={<Add />}
          sx={{
            borderColor: lightGreen,
            color: white,
            background: midGreen,
            borderRadius: "8px",
            "&:hover": { borderColor: white, background: lightGreen },
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Add Education
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={loading || !isFormValid}
          sx={{
            background: lightGreen,
            color: white,
            borderRadius: "8px",
            px: 4,
            fontWeight: 700,
            "&:hover": { background: midGreen },
            textTransform: "none",
          }}
          startIcon={loading ? <CircularProgress size={20} sx={{ color: white }} /> : null}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Stack>
    </Box>
  );
}

export default Education;