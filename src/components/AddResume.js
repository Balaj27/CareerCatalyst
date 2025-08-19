import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewResume } from "../Services/resumeAPI";
import { setResumeId, setResumeData } from "../store";
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";

function AddResume() {
  const [open, setOpen] = useState(false);
  const [resumetitle, setResumetitle] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!resumetitle.trim()) return;
    const newResume = await createNewResume({ title: resumetitle });
    dispatch(setResumeId(newResume.id));
    dispatch(setResumeData(newResume));
    setOpen(false);
    setResumetitle("");
    // Navigate to form with this resume ID
    navigate(`/resumes/${newResume.id}`);
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>Add Resume</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Resume</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Resume Title"
            value={resumetitle}
            onChange={e => setResumetitle(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddResume;