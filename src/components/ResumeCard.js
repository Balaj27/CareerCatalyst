import React from "react";
import { FaEye, FaEdit, FaTrashAlt, FaSpinner } from "react-icons/fa";
import { deleteThisResume, getResumeByTitle } from "../Services/resumeAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setResumeData, setResumeId } from "../store";

const gradients = [
  "linear-gradient(to right, #6366F1, #A855F7, #EC4899)",
  "linear-gradient(to right, #4ADE80, #3B82F6, #9333EA)",
  "linear-gradient(to right, #F87171, #FBBF24, #4ADE80)",
  "linear-gradient(to right, #3B82F6, #2DD4BF, #84CC16)",
  "linear-gradient(to right, #EC4899, #EF4444, #FBBF24)",
];

const getRandomGradient = () => {
  return gradients[Math.floor(Math.random() * gradients.length)];
};

function ResumeCard({ resume, refreshData }) {
  const [loading, setLoading] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const gradient = getRandomGradient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Helper: given title, fetch resume by title from db
  const getResumeByTitleHandler = async (title) => {
    try {
      const found = await getResumeByTitle(title);
      return found;
    } catch (err) {
      toast("Could not find resume by title.", { type: "error" });
      return null;
    }
  };

  // View handler
  const handleView = async () => {
    setLoading(true);
    const found = await getResumeByTitleHandler(resume.title);
    setLoading(false);
    const resumeId = found?.id || found?._id;
    if (resumeId) {
      dispatch(setResumeId(resumeId));
      dispatch(setResumeData(found));
      navigate(`/view-resumes/${resumeId}`);
    } else {
      toast("Resume not found.", { type: "error" });
    }
  };

  // Edit handler
  const handleEdit = async () => {
    setLoading(true);
    const found = await getResumeByTitleHandler(resume.title);
    setLoading(false);
    const resumeId = found?.id || found?._id;
    if (resumeId) {
      dispatch(setResumeId(resumeId));
      dispatch(setResumeData(found));
      navigate(`/resumes/${resumeId}`);
    } else {
      toast("Could not find resume to edit.", { type: "error" });
    }
  };

  // Delete handler
  const handleDelete = async () => {
    setLoading(true);
    const found = await getResumeByTitleHandler(resume.title);
    const id = found?.id || found?._id;
    if (!id) {
      setLoading(false);
      setOpenAlert(false);
      toast("Could not find resume to delete.", { type: "error" });
      return;
    }
    try {
      await deleteThisResume(id);
      toast("Resume deleted", { type: "success" });
    } catch (error) {
      toast(error.message || "Error deleting resume", { type: "error" });
    } finally {
      setLoading(false);
      setOpenAlert(false);
      refreshData();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: { xs: 380, sm: "auto" },
        borderRadius: 2,
        background: gradient,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          bgcolor: "white",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          boxShadow: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            mx: 1,
            backgroundImage: gradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {resume.title}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          p: 2,
          bgcolor: "white",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          boxShadow: 1,
        }}
      >
        <Button color="inherit" onClick={handleView} sx={{ mx: 1 }} disabled={loading}>
          <FaEye />
        </Button>
        <Button color="inherit" onClick={handleEdit} sx={{ mx: 1 }} disabled={loading}>
          <FaEdit />
        </Button>
        <Button color="inherit" onClick={() => setOpenAlert(true)} sx={{ mx: 1 }} disabled={loading}>
          <FaTrashAlt />
        </Button>
      </Box>

      <Dialog open={openAlert} onClose={() => setOpenAlert(false)}>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. This will permanently delete your
            Resume and remove your data from our servers.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAlert(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" disabled={loading}>
            {loading ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default ResumeCard;