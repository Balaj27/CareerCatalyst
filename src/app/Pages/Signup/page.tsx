"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography, Container, Paper } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useRouter } from "next/navigation";

import { auth, db } from "../../lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, "employees"), {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
      });

      router.push("/Pages/EmployeeSetup");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  // 🟢 Google Signup Handler
  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔄 Check if user already exists in Firestore
      const q = query(collection(db, "employees"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // ➡️ New User: Save to Firestore
        await addDoc(collection(db, "employees"), {
          uid: user.uid,
          email: user.email,
          createdAt: new Date(),
        });
      }

      router.push("/Pages/EmployeeSetup");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Create an Account
        </Typography>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}
          onClick={handleSignup}
        >
          Sign Up
        </Button>

        {/* Google Sign-Up */}
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<GoogleIcon />}
          sx={{ textTransform: "none", borderRadius: 2, my: 2 }}
          onClick={handleGoogleSignup} // ✅ Enabled here
        >
          Continue with Google
        </Button>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Button
              variant="text"
              sx={{ textTransform: "none", fontWeight: "bold" }}
              onClick={() => router.push("/Pages/Login")}
            >
              Login
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
