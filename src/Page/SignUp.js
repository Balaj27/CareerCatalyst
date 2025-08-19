import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// --- Theme Styled Components ---
const PageWrapper = styled(Box)({
  backgroundColor: "#004D40",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
});

const FormWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#004D40",
  maxWidth: "400px",
  width: "100%",
  padding: "40px",
  border: "1px solid #00A389",
  borderRadius: "8px",
  boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
  [theme.breakpoints.down("sm")]: {
    padding: "20px",
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "28px",
  fontWeight: "bold",
  color: "white",
  marginBottom: "8px",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "24px",
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  color: "white",
  marginBottom: "24px",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
  },
}));

const InputField = styled(TextField)(({ error }) => ({
  marginBottom: "16px",
  "& .MuiOutlinedInput-root": {
    height: "56px",
    color: "white",
    "& fieldset": {
      borderColor: error ? "#f44336" : "#00A389",
      borderRadius: "4px",
    },
    "&:hover fieldset": {
      borderColor: error ? "#f44336" : "#00A389",
    },
    "&.Mui-focused fieldset": {
      borderColor: error ? "#f44336" : "#00A389",
    },
  },
  "& .MuiInputBase-input": {
    color: "white",
    "&::placeholder": {
      color: "rgba(255, 255, 255, 0.7)",
      opacity: 1,
    },
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  },
  "& .MuiFormHelperText-root": {
    color: "#f44336",
    marginLeft: 0,
  },
}));

const RegisterButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#00A389",
  color: "white",
  height: "56px",
  borderRadius: "4px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: "500",
  width: "100%",
  margin: "16px 0 0 0",
  "&:hover": {
    backgroundColor: "#00897B",
  },
}));

const GoogleButton = styled(Button)(({ theme }) => ({
  backgroundColor: "transparent",
  color: "white",
  height: "56px",
  borderRadius: "4px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: "500",
  width: "100%",
  margin: "16px 0 0 0",
  border: "1px solid #00A389",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
}));

const LoginText = styled(Typography)({
  color: "white",
  textAlign: "center",
  marginTop: "24px",
});

const LoginLinkButton = styled(Button)({
  color: "white",
  fontWeight: "bold",
  textTransform: "none",
  padding: 0,
  minWidth: 0,
  "&:hover": {
    textDecoration: "underline",
    background: "transparent",
  },
});

export default function Signup() {
  const navigate = useNavigate();

  // --- Switch state for Job Seeker/Employer ---
  const [isEmployer, setIsEmployer] = useState(false);

  // --- Common States ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // --- Employer-specific fields ---
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");

  // --- Job Seeker fields remain the same (no extra fields needed)

  const handleSignup = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (isEmployer) {
        // Store employer data
        await addDoc(collection(db, "employers"), {
          uid: user.uid,
          email: user.email,
          companyName,
          companyWebsite,
          companyLocation,
          createdAt: new Date(),
        });

        setNotification({
          open: true,
          message: "Employer account created successfully!",
          severity: "success",
        });

        setTimeout(() => navigate("/employer-setup"), 1000);
      } else {
        // Store employee data
        await addDoc(collection(db, "employees"), {
          uid: user.uid,
          email: user.email,
          createdAt: new Date(),
        });

        setNotification({
          open: true,
          message: "Account created successfully!",
          severity: "success",
        });

        setTimeout(() => navigate("/profile-setup"), 1000);
      }
    } catch (err) {
      setError(err.message);
      setNotification({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  // Google Signup Handler
  const handleGoogleSignup = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (isEmployer) {
        // Check if employer already exists
        const q = query(
          collection(db, "employers"),
          where("uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // New Employer: Save to Firestore
          await addDoc(collection(db, "employers"), {
            uid: user.uid,
            email: user.email,
            companyName,
            companyWebsite,
            companyLocation,
            createdAt: new Date(),
          });
        }

        setNotification({
          open: true,
          message: "Signed up as Employer with Google successfully!",
          severity: "success",
        });

        setTimeout(() => navigate("/employer-setup"), 1000);
      } else {
        // Check if employee already exists
        const q = query(
          collection(db, "employees"),
          where("uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // New User: Save to Firestore
          await addDoc(collection(db, "employees"), {
            uid: user.uid,
            email: user.email,
            createdAt: new Date(),
          });
        }

        setNotification({
          open: true,
          message: "Signed up with Google successfully!",
          severity: "success",
        });

        setTimeout(() => navigate("/profile-setup"), 1000);
      }
    } catch (err) {
      setError(err.message);
      setNotification({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <PageWrapper>
      <FormWrapper>
        <FormControlLabel
          control={
            <Switch
              checked={isEmployer}
              onChange={() => setIsEmployer((prev) => !prev)}
              color="primary"
            />
          }
          label={
            <Typography sx={{ color: "white", fontWeight: "bold" }}>
              {isEmployer ? "Sign up as Employer" : "Sign up as Job Seeker"}
            </Typography>
          }
          sx={{ mb: 2, justifyContent: "center", width: "100%" }}
        />

        <Title>Create an Account</Title>
        <Subtitle>
          {isEmployer
            ? "Enter your company details to sign up as Employer"
            : "Enter your credentials below to sign up"}
        </Subtitle>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isEmployer && (
          <>
            <InputField
              fullWidth
              label="Company Name"
              variant="outlined"
              margin="normal"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              autoComplete="organization"
            />

            <InputField
              fullWidth
              label="Company Website"
              variant="outlined"
              margin="normal"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              autoComplete="url"
            />

            <InputField
              fullWidth
              label="Company Location"
              variant="outlined"
              margin="normal"
              value={companyLocation}
              onChange={(e) => setCompanyLocation(e.target.value)}
              autoComplete="address"
            />
          </>
        )}

        <InputField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <InputField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <InputField
          fullWidth
          label="Confirm Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        <RegisterButton variant="contained" onClick={handleSignup}>
          {isEmployer ? "Sign Up as Employer" : "Sign Up"}
        </RegisterButton>

        <GoogleButton
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignup}
        >
          {isEmployer ? "Continue as Employer with Google" : "Continue with Google"}
        </GoogleButton>

        <LoginText>
          Already have an account?{" "}
          <LoginLinkButton
            variant="text"
            onClick={() =>
              navigate(isEmployer ? "/employer-setup" : "/Pages/Login")
            }
          >
            Login
          </LoginLinkButton>
        </LoginText>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseNotification}
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