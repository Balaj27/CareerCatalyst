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
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider
} from "@mui/material";
import { createNewResume } from "../../../Services/resumeAPI";
import { useNavigate } from "react-router-dom";

function AddResume() {
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [resumetitle, setResumetitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
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
        template: selectedTemplate,
      },
    };
    console.log(`Creating Resume ${resumetitle} with template ${selectedTemplate}`);
    createNewResume(data)
      .then((res) => {
        console.log("Printing From AddResume Response of Create Resume", res);
        navigate(`/Resume/edit-resume/${res.data.resume._id}`);
      })
      .finally(() => {
        setLoading(false);
        setResumetitle("");
        setSelectedTemplate("modern");
      });
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedTemplate("modern");
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

      <Dialog open={isDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create a New Resume</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a title and select a template for your new resume
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            placeholder="Ex: Backend Resume"
            value={resumetitle}
            onChange={(e) => setResumetitle(e.target.value.trimStart())}
            sx={{ mt: 2, mb: 3 }}
          />
          
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Choose Template
          </Typography>
          <RadioGroup
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                border: selectedTemplate === "modern" ? 2 : 1,
                borderColor: selectedTemplate === "modern" ? "primary.main" : "divider",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: 1,
                },
              }}
              onClick={() => setSelectedTemplate("modern")}
            >
              <FormControlLabel
                value="modern"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Modern Template
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Clean and contemporary design with top border accent
                    </Typography>
                  </Box>
                }
              />
            </Paper>
            
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: selectedTemplate === "classic" ? 2 : 1,
                borderColor: selectedTemplate === "classic" ? "primary.main" : "divider",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: 1,
                },
              }}
              onClick={() => setSelectedTemplate("classic")}
            >
              <FormControlLabel
                value="classic"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Classic Template
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Traditional two-column layout with sidebar
                    </Typography>
                  </Box>
                }
              />
            </Paper>
          </RadioGroup>
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