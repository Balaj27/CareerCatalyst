import React, { useState } from "react";
import { CopyPlus, Loader } from "lucide-react";
import { createNewResume } from "../services/ResumeAPI";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Paper
} from '@mui/material';

function AddResume() {
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [resumetitle, setResumetitle] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Only use useNavigate if we're in a browser environment with Router available
  let navigate = null;
  try {
    navigate = useNavigate();
  } catch (error) {
    console.warn("Router context not available. Navigation will be disabled.");
  }

  const createResume = async () => {
    setLoading(true);
    if (resumetitle === "") {
      console.log("Please add a title to your resume");
      setLoading(false);
      return;
    }
      
    const data = {
      data: {
        title: resumetitle,
        themeColor: "#000000",
      },
    };
    
    console.log(`Creating Resume ${resumetitle}`);
    
    try {
      const res = await createNewResume(data);
      console.log("Printing From AddResume Response of Create Resume", res);
      
      // Only navigate if the hook is available
      if (navigate) {
        navigate(`../../components/edit-resume/${res.data.resume._id}`);
      } else {
        // Alternative action when Router is not available
        console.log("Navigation not available. Resume created successfully:", res.data.resume._id);
        setOpenDialog(false);
        // You might want to trigger a refresh or other action here
      }
    } catch (error) {
      console.error("Error creating resume:", error);
    } finally {
      setLoading(false);
      setResumetitle("");
    }
  };
  
  return (
    <>
      <Paper 
        elevation={1}
        sx={{
          height: 380,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          bgcolor: 'action.hover',
          cursor: 'pointer',
          transition: 'all 0.4s',
          py: 12,
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 3
          }
        }}
        onClick={() => setOpenDialog(true)}
      >
        <CopyPlus sx={{ transition: 'transform 0.3s' }} />
      </Paper>
      
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create a New Resume</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a title and Description to your new resume
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            placeholder="Ex: Backend Resume"
            value={resumetitle}
            onChange={(e) => setResumetitle(e.target.value.trimStart())}
            sx={{ my: 1.5 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={createResume} 
            disabled={!resumetitle || loading}
            variant="contained"
          >
            {loading ? (
              <Loader sx={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              "Create Resume"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddResume;