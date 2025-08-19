import React, { useEffect, useState, useMemo } from "react";
import { Box, Button, Grid, TextField, Typography, IconButton, CircularProgress, Stack } from "@mui/material";
import { Trash2 } from "lucide-react";
import SimpeRichTextEditor from "../../../../../components/SimpeRichTextEditor";
import { useDispatch } from "react-redux";
import { addResumeData } from "../../../../../features/resume/resumeFeatures";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { updateThisResume } from "../../../../../Services/resumeAPI";

// THEME COLORS
const mainGreen = "linear-gradient(90deg, #16382C 0%, #225144 100%)";
const darkGreen = "#16382C";
const midGreen = "#225144";
const lightGreen = "#2D6F5B";
const white = "#fff";
const borderRadius = "16px";

const initialFormFields = {
  projectName: "",
  techStack: "",
  projectSummary: "",
};

function Project({ resumeInfo }) {
  const { resumeId, resume_id } = useParams();
  const resolvedResumeId = resumeId || resume_id;
  const dispatch = useDispatch();

  const [projectList, setProjectList] = useState(
    resumeInfo?.projects && resumeInfo.projects.length > 0 ? resumeInfo.projects : []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProjectList(
      resumeInfo?.projects && resumeInfo.projects.length > 0 ? resumeInfo.projects : []
    );
  // eslint-disable-next-line
  }, [resolvedResumeId]);

  const isFormValid = useMemo(() => {
    return projectList.length > 0 && projectList.every(
      (project) =>
        (project.projectName || "").trim() &&
        (project.techStack || "").trim()
    );
  }, [projectList]);

  const setAndDispatchProjectList = (newList) => {
    setProjectList(newList);
    dispatch(addResumeData({ ...resumeInfo, projects: newList }));
  };

  const addProject = () => {
    const newList = [...projectList, { ...initialFormFields }];
    setAndDispatchProjectList(newList);
  };

  const removeProject = (index) => {
    const newList = projectList.filter((_, i) => i !== index);
    setAndDispatchProjectList(newList);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedList = projectList.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setAndDispatchProjectList(updatedList);
  };

  const handleRichTextEditor = (value, name, index) => {
    const updatedList = projectList.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setAndDispatchProjectList(updatedList);
  };

  const onSave = async () => {
    if (!isFormValid) {
      toast("Please fill in all required project fields", { type: "error" });
      return;
    }

    if (!resolvedResumeId) {
      toast("No resume selected", { type: "error" });
      return;
    }

    setLoading(true);
    try {
      await updateThisResume(resolvedResumeId, { projects: projectList });
      toast("Projects saved", { type: "success" });
    } catch (error) {
      toast("Error updating projects", { description: error.message });
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
        Projects
      </Typography>
      <Typography variant="body2" sx={{ color: "#d0e7dd" }}>
        Add your projects
      </Typography>

      {projectList.map((project, index) => (
        <Box
          key={index}
          mt={3}
          sx={{
            background: darkGreen,
            borderRadius: "12px",
            p: 3,
            boxShadow: "0 1px 6px rgba(22,56,44,0.08)",
            mb: 2,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: white }}>
              Project {index + 1}
            </Typography>
            <IconButton
              sx={{
                color: "#f44336",
                background: "#fff2",
                borderRadius: "8px",
                "&:hover": { background: "#fff4" },
                ...(projectList.length === 1 && { opacity: 0.5, pointerEvents: "none" }),
              }}
              onClick={() => removeProject(index)}
              size="small"
              disabled={projectList.length === 1}
            >
              <Trash2 size={20} />
            </IconButton>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project Name"
                name="projectName"
                value={project.projectName || ""}
                onChange={(e) => handleChange(e, index)}
                required
                error={(project.projectName || "").trim() === ""}
                helperText={(project.projectName || "").trim() === "" ? "Project name is required" : ""}
                variant="filled"
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tech Stack"
                name="techStack"
                placeholder="React, Node.js, MongoDB"
                value={project.techStack || ""}
                onChange={(e) => handleChange(e, index)}
                required
                error={(project.techStack || "").trim() === ""}
                helperText={(project.techStack || "").trim() === "" ? "Tech stack is required" : ""}
                variant="filled"
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
            <Grid item xs={12}>
              <Typography variant="subtitle2" mb={1} sx={{ color: "#c4e2d7" }}>
                Project Summary
              </Typography>
              <SimpeRichTextEditor
                index={index}
                section="projects"
                field="projectSummary"
                resumeInfo={resumeInfo}
                onRichTextEditorChange={(value, name, i) =>
                  handleRichTextEditor(value, name, i)
                }
                initialValue={project.projectSummary || ""}
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Stack direction="row" justifyContent="space-between" mt={3}>
        <Button
          onClick={addProject}
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
        >
          + Add {projectList.length > 0 ? "more" : ""} project
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
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

export default Project;