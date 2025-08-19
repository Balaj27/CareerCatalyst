import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addResumeData } from "../../../../../features/resume/resumeFeatures";
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

function Skills({ resumeInfo }) {
  const [skillsList, setSkillsList] = useState(
    resumeInfo?.skills || [{ name: "", rating: 0 }]
  );
  const [loading, setLoading] = useState(false);
  const { resumeId, resume_id } = useParams();
  const resolvedResumeId = resumeId || resume_id;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, skills: skillsList }));
  }, [skillsList, dispatch]);

  const AddNewSkills = () => {
    setSkillsList([...skillsList, { name: "", rating: 0 }]);
  };

  const RemoveSkills = () => {
    if (skillsList.length > 0) {
      setSkillsList(skillsList.slice(0, -1));
    }
  };

  const handleChange = (index, key, value) => {
    const list = [...skillsList];
    list[index] = { ...list[index], [key]: value };
    setSkillsList(list);
  };

  const isFormValid =
    skillsList.length > 0 && skillsList.every((skill) => skill.name.trim() !== "");

  const onSave = async () => {
    if (!isFormValid) {
      toast("Please fill all skill names", { type: "error" });
      return;
    }
    if (!resolvedResumeId) {
      toast("No resume selected", { type: "error" });
      return;
    }
    setLoading(true);
    try {
      await updateThisResume(resolvedResumeId, { skills: skillsList });
      toast("Skills saved", { type: "success" });
    } catch (error) {
      toast(error.message || "Failed to save skills", { type: "error" });
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
        Skills
      </Typography>
      <Typography variant="body2" sx={{ color: "#d0e7dd" }} mb={2}>
        Add your top professional key skills
      </Typography>

      <Box>
        {skillsList.map((item, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              background: darkGreen,
              borderRadius: "12px",
              p: 2,
              mb: 2,
            }}
          >
            <TextField
              label="Skill Name"
              value={item.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              fullWidth
              size="small"
              required
              error={item.name.trim() === ""}
              helperText={item.name.trim() === "" ? "Skill name is required" : ""}
              variant="filled"
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
          </Box>
        ))}
      </Box>

      <Stack direction="row" justifyContent="space-between" mt={3}>
        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            onClick={AddNewSkills}
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
            + Add More Skill
          </Button>
          <Button
            variant="outlined"
            onClick={RemoveSkills}
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
            - Remove
          </Button>
        </Stack>
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

export default Skills;