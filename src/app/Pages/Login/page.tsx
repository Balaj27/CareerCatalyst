"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography, Container, Paper } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../lib/firebase"; // adjust path based on your project

export default function Login() {
  const router = useRouter();

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Friendly error mapping
  const getFriendlyError = (code: string) => {
    switch (code) {
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/invalid-email":
        return "Invalid email format.";
      case "auth/popup-closed-by-user":
        return "Sign-in popup closed before completing sign in.";
      case "auth/cancelled-popup-request":
        return "Only one popup request is allowed at a time.";
      default:
        return "Authentication failed. Please try again.";
    }
  };

  // Email/password login handler
  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/Pages/Dashboard");
    } catch (err: any) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Google login handler
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/Pages/Dashboard");
    } catch (err: any) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Login to CareerCatalyst
        </Typography>

        {/* Email Input */}
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input */}
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Error */}
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        {/* Login Button */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {/* Links */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="text"
            sx={{ textTransform: "none" }}
            onClick={() => router.push("/forgot-password")}
          >
            Forgot Password?
          </Button>
          <Button
            variant="text"
            sx={{ textTransform: "none" }}
            onClick={() => router.push("/Pages/Signup")}
          >
            Sign Up
          </Button>
        </Box>

        {/* Google Sign-In */}
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<GoogleIcon />}
          sx={{ textTransform: "none", borderRadius: 2, my: 2 }}
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? "Processing..." : "Continue with Google"}
        </Button>
      </Paper>
    </Container>
  );
}
