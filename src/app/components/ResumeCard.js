import React from "react";
import { FaEye, FaEdit, FaTrashAlt, FaSpinner } from "react-icons/fa";
import { deleteThisResume } from "../services/ResumeAPI";
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
  Paper
} from '@mui/material';

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

  const handleDelete = async () => {
    setLoading(true);
    console.log("Delete Resume with ID", resume._id);
    try {
      const response = await deleteThisResume(resume._id);
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
      elevation={3}
      sx={{
        height: { xs: 380, sm: 'auto' },
        borderRadius: 2,
        background: gradient,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          bgcolor: 'white',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          boxShadow: 1
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            mx: 1,
            backgroundImage: gradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          {resume.title}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          p: 2,
          bgcolor: 'white',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          boxShadow: 1
        }}
      >
        <Button 
          color="inherit"
          onClick={() => navigate(`/dashboard/view-resume/${resume._id}`)}
          sx={{ mx: 1 }}
        >
          <FaEye sx={{ 
            color: 'text.secondary',
            '&:hover': { color: '#4F46E5' },
            transition: 'color 0.3s ease-in-out'
          }} />
        </Button>
        <Button 
          color="inherit"
          onClick={() => navigate(`/dashboard/edit-resume/${resume._id}`)}
          sx={{ mx: 1 }}
        >
          <FaEdit sx={{ 
            color: 'text.secondary',
            '&:hover': { color: '#9333EA' },
            transition: 'color 0.3s ease-in-out'
          }} />
        </Button>
        <Button 
          color="inherit"
          onClick={() => setOpenAlert(true)}
          sx={{ mx: 1 }}
        >
          <FaTrashAlt sx={{ 
            color: 'text.secondary',
            '&:hover': { color: '#DB2777' },
            transition: 'color 0.3s ease-in-out'
          }} />
        </Button>
      </Box>

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
        <DialogActions>
          <Button onClick={() => setOpenAlert(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" disabled={loading}>
            {loading ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default ResumeCard;