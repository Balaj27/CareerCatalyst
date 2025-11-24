import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Email, Close, Send } from '@mui/icons-material';

const EmailShareDialog = ({ open, onClose, onSend, senderName }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setRecipientEmail(email);
    
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSend = async () => {
    // Validation
    if (!recipientEmail) {
      setEmailError('Email address is required');
      return;
    }

    if (!validateEmail(recipientEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await onSend(recipientEmail, message);
      // Reset form
      setRecipientEmail('');
      setMessage('');
      setEmailError('');
    } catch (error) {
      console.error('Error in handleSend:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setRecipientEmail('');
      setMessage('');
      setEmailError('');
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey && !loading) {
      handleSend();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Email color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Share Resume via Email
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={loading} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Send your resume as a PDF attachment to any email address. The recipient will receive it directly in their inbox.
          </Typography>

          {/* Recipient Email Field */}
          <TextField
            autoFocus
            required
            fullWidth
            label="Recipient Email"
            type="email"
            value={recipientEmail}
            onChange={handleEmailChange}
            onKeyPress={handleKeyPress}
            error={!!emailError}
            helperText={emailError || 'Enter the email address of the recipient'}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Optional Message */}
          <TextField
            fullWidth
            label="Personal Message (Optional)"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            placeholder="Add a personal message to accompany your resume..."
            helperText={`${message.length}/500 characters`}
            inputProps={{ maxLength: 500 }}
            sx={{ mb: 2 }}
          />

          {/* Info Alert */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="caption">
              Your resume will be sent as a PDF attachment. The recipient will see your name ({senderName || 'Unknown'}) as the sender.
            </Typography>
          </Alert>

          {/* Tips */}
          <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
            <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>
              💡 Tips:
            </Typography>
            <Typography variant="caption" component="div" sx={{ pl: 2 }}>
              • Double-check the recipient's email address
              <br />
              • Add a personalized message for better engagement
              <br />
              • Press Ctrl+Enter to send quickly
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          variant="contained"
          disabled={loading || !recipientEmail || !!emailError}
          startIcon={loading ? <CircularProgress size={16} /> : <Send />}
          sx={{
            minWidth: 120,
            background: 'linear-gradient(90deg, #16382C 0%, #225144 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #225144 0%, #2D6F5B 100%)',
            }
          }}
        >
          {loading ? 'Sending...' : 'Send Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailShareDialog;
