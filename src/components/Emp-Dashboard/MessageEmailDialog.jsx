import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from "@mui/material";
import { sendCandidateEmail } from "../../Services/sendCandidateEmail";

const MessageEmailDialog = ({ open, onClose, candidate, job }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    setSending(true);
    setError("");
    setSuccess(false);
    try {
      await sendCandidateEmail({
        to: candidate.email,
        subject: `Message regarding your application for ${job?.title || "the job"}`,
        body: message,
        company: job?.company || "Company",
        jobTitle: job?.title || "Job Title",
        candidateName: candidate.name || candidate.email,
      });
      setSuccess(true);
      setMessage("");
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    setError("");
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Send Message to {candidate?.name || candidate?.email}</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          <b>Job:</b> {job?.title} <br />
          <b>Company:</b> {job?.company}
        </Typography>
        <TextField
          label="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          fullWidth
          multiline
          minRows={4}
          margin="normal"
          disabled={sending}
        />
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">Message sent successfully!</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={sending}>Cancel</Button>
        <Button onClick={handleSend} variant="contained" color="primary" disabled={sending || !message}>
          {sending ? "Sending..." : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageEmailDialog;
