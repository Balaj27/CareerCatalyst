import React, { useState } from "react";
import { Box, Typography, TextField, Button, Alert, Snackbar, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

const PageWrapper = styled(Box)({ backgroundColor: "#004D40", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" });
const FormWrapper = styled(Box)(({ theme }) => ({ backgroundColor: "#004D40", maxWidth: "400px", width: "100%", padding: "32px", border: "1px solid #00A389", borderRadius: "8px", color: "white" }));
const Title = styled(Typography)({ fontSize: "24px", fontWeight: "bold", color: "white", marginBottom: "16px" });
const InputField = styled(TextField)({
  "& .MuiOutlinedInput-root": { color: "white", "& fieldset": { borderColor: "#00A389" }, "&:hover fieldset": { borderColor: "#00A389" }, "&.Mui-focused fieldset": { borderColor: "#00A389" } },
  "& .MuiInputBase-input": { color: "white" },
  "& .MuiFormHelperText-root": { color: "#f44336" },
  marginBottom: "16px"
});
const ActionButton = styled(Button)({ backgroundColor: "#00A389", color: "white", borderRadius: "4px", textTransform: "none", fontWeight: "500", width: "100%", marginBottom: "16px", "&:hover": { backgroundColor: "#00897B" } });

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/forgot-password", { email });
      setNotification({ open: true, message: "OTP sent to your email.", severity: "success" });
      setStep(2);
    } catch (error) {
      setNotification({ open: true, message: error.response?.data?.error || "Failed to send OTP.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/verify-otp", { email, otp });
      setNotification({ open: true, message: "OTP verified. Please enter new password.", severity: "success" });
      setStep(3);
    } catch (error) {
      setNotification({ open: true, message: error.response?.data?.error || "Invalid OTP.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      // TODO: Implement password update in your user database (Firebase or custom backend)
      setNotification({ open: true, message: "Password reset successful!", severity: "success" });
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (error) {
      setNotification({ open: true, message: "Failed to reset password.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <FormWrapper>
        <Title>Forgot Password</Title>
        {step === 1 && (
          <>
            <InputField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <ActionButton onClick={handleSendOtp} disabled={loading || !email}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
            </ActionButton>
          </>
        )}
        {step === 2 && (
          <>
            <InputField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
            />
            <ActionButton onClick={handleVerifyOtp} disabled={loading || !otp}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
            </ActionButton>
          </>
        )}
        {step === 3 && (
          <>
            <InputField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <ActionButton onClick={handleResetPassword} disabled={loading || !newPassword}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
            </ActionButton>
          </>
        )}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </FormWrapper>
    </PageWrapper>
  );
}
