import React, { useState } from "react";
import { FileCopy, Loop } from "@mui/icons-material";
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Button,
  TextField,
  Paper,
  Box,
  Typography
} from "@mui/material";
import { createNewResume } from "../../../Services/resumeAPI";
import { useNavigate } from "react-router-dom";

function AddResume() {
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [resumetitle, setResumetitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createResume = async () => {
    setLoading(true);
    if (resumetitle === "")
      return console.log("Please add a title to your resume");
    const data = {
      data: {
        title: resumetitle,
        themeColor: "#000000",
      },
    };
    console.log(`Creating Resume ${resumetitle}`);
    createNewResume(data)
      .then((res) => {
        console.log("Printing From AddResume Response of Create Resume", res);
        navigate(`/Resume/edit-resume/${res.data.resume._id}`);
      })
      .finally(() => {
        setLoading(false);
        setResumetitle("");
      });
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          padding: 7,
          paddingY: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid",
          borderColor: "action.hover",
          bgcolor: "action.hover",
          borderRadius: 2,
          height: 380,
          cursor: "pointer",
          transition: "all 0.4s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: 3,
          }
        }}
        onClick={() => setOpenDialog(true)}
      >
        <FileCopy sx={{ transition: "transform 0.3s" }} />
      </Paper>

      <Dialog open={isDialogOpen} onClose={handleClose}>
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
            sx={{ mt: 2, mb: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={createResume} 
            disabled={!resumetitle || loading} 
            variant="contained"
            startIcon={loading ? <Loop sx={{ animation: "spin 1s linear infinite" }} /> : null}
          >
            {loading ? "Creating..." : "Create Resume"}
          </Button>
        </DialogActions>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </Dialog>
    </>
  );
}

export default AddResume;