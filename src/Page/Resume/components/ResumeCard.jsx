import React, { useState } from "react";
import { 
  Visibility, 
  Edit, 
  DeleteOutline, 
  RotateLeft 
} from "@mui/icons-material";
import { 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Typography,
  Paper,
  IconButton
} from "@mui/material";
import { deleteThisResume } from "../../../Services/resumeAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// MUI equivalent gradient backgrounds
const gradients = [
  "linear-gradient(45deg, #6366F1 30%, #A855F7 65%, #EC4899 90%)",
  "linear-gradient(45deg, #10B981 30%, #3B82F6 65%, #8B5CF6 90%)",
  "linear-gradient(45deg, #F87171 30%, #FBBF24 65%, #10B981 90%)",
  "linear-gradient(45deg, #3B82F6 30%, #2DD4BF 65%, #86EFAC 90%)",
  "linear-gradient(45deg, #EC4899 30%, #EF4444 65%, #F59E0B 90%)"
];

const getRandomGradient = () => {
  return gradients[Math.floor(Math.random() * gradients.length)];
};

function ResumeCard({ resume, refreshData }) {
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const gradient = getRandomGradient();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    console.log("Delete Resume with ID", resume._id);
    try {
      await deleteThisResume(resume._id);
    } catch (error) {
      console.error("Error deleting resume:", error.message);
      toast(error.message);
    } finally {
      setLoading(false);
      setOpenAlert(false);
      refreshData();
    }
  };

  return (
    <Paper
      sx={{
        height: { xs: 380, sm: "auto" },
        borderRadius: 2,
        background: gradient,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: 3,
        transition: "box-shadow 0.3s ease-in-out",
        cursor: "pointer",
        "&:hover": {
          boxShadow: 10
        },
        padding: 2.5
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 3,
          borderRadius: "8px 8px 0 0"
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            mx: 1,
            background: gradient,
            backgroundClip: "text",
            textFillColor: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          {resume.title}
        </Typography>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: 2,
          borderRadius: "0 0 8px 8px"
        }}
      >
        <IconButton
          onClick={() => navigate(`/Resume/view-resume/${resume._id}`)}
          sx={{
            mx: 1,
            color: "text.secondary",
            "&:hover": { color: "#6366F1" },
            transition: "color 0.3s"
          }}
        >
          <Visibility />
        </IconButton>
        
        <IconButton
          onClick={() => navigate(`/Resume/edit-resume/${resume._id}`)}
          sx={{
            mx: 1,
            color: "text.secondary",
            "&:hover": { color: "#A855F7" },
            transition: "color 0.3s"
          }}
        >
          <Edit />
        </IconButton>
        
        <IconButton
          onClick={() => setOpenAlert(true)}
          sx={{
            mx: 1,
            color: "text.secondary",
            "&:hover": { color: "#EC4899" },
            transition: "color 0.3s"
          }}
        >
          <DeleteOutline />
        </IconButton>

        <Dialog
          open={openAlert}
          onClose={() => setOpenAlert(false)}
        >
          <DialogTitle>
            Are you absolutely sure?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              This action cannot be undone. This will permanently delete your
              Resume and remove your data from our servers.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={() => setOpenAlert(false)} 
              color="inherit"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete} 
              disabled={loading}
              color="error"
              variant="contained"
              startIcon={loading ? <RotateLeft sx={{ animation: "spin 1s linear infinite" }} /> : null}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Paper>
  );
}

export default ResumeCard;