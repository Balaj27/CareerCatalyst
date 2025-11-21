import { useState } from "react";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from "@mui/material";

const MessageDialog = ({ open, onClose, job, employerId }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }
    setSending(true);
    setError("");
    try {
      await addDoc(collection(db, "messages"), {
        jobId: job.id,
        senderId: auth.currentUser.uid,
        receiverId: employerId,
        content: message,
        timestamp: serverTimestamp(),
      });
      setMessage("");
      onClose();
    } catch (err) {
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Contact Employer</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>Send a message to the employer about <b>{job?.title}</b>.</Typography>
        <TextField
          label="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          margin="normal"
          disabled={sending}
        />
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={sending}>Cancel</Button>
        <Button onClick={handleSend} variant="contained" disabled={sending}>{sending ? "Sending..." : "Send"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;
