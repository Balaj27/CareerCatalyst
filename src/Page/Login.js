import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { Visibility, VisibilityOff, Google as GoogleIcon } from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth, db } from "../lib/firebase" // adjust path based on your project
import { collection, query, where, getDocs } from "firebase/firestore"

// Main container
const PageWrapper = styled(Box)({
  backgroundColor: "#004D40",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  padding: "20px",
})

const FormWrapper = styled(Box)({
  backgroundColor: "#004D40",
  maxWidth: "600px",
  width: "100%",
  padding: "40px",
  border: "1px solid #00A389",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
})

// Form title and subtitle
const Title = styled(Typography)({
  fontSize: "28px",
  fontWeight: "bold",
  color: "white",
  marginBottom: "8px",
  alignSelf: "flex-start",
})

const Subtitle = styled(Typography)({
  fontSize: "16px",
  color: "white",
  marginBottom: "4px",
  alignSelf: "flex-start",
})

const Divider = styled(Box)({
  height: "1px",
  backgroundColor: "#00A389",
  width: "100%",
  margin: "24px 0 32px 0",
})

// Field label
const FieldLabel = styled(Typography)({
  fontSize: "16px",
  color: "white",
  marginBottom: "8px",
  alignSelf: "flex-start",
  width: "100%",
})

// Custom input field
const InputField = styled(TextField)(({ error }) => ({
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
  width: "100%",
  marginBottom: "24px",
}))

// Forgot password link
const ForgotPasswordLink = styled(Link)({
  color: "white",
  textDecoration: "none",
  fontSize: "14px",
  alignSelf: "flex-start",
  marginTop: "-16px",
  marginBottom: "32px",
  "&:hover": {
    textDecoration: "underline",
  },
})

// Login button
const LoginButton = styled(Button)({
  backgroundColor: "#00A389",
  color: "white",
  height: "56px",
  borderRadius: "4px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: "500",
  width: "100%",
  marginBottom: "16px",
  "&:hover": {
    backgroundColor: "#00897B",
  },
})

// Google button
const GoogleButton = styled(Button)({
  backgroundColor: "transparent",
  color: "white",
  height: "56px",
  borderRadius: "4px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: "500",
  width: "100%",
  border: "1px solid #00A389",
  marginBottom: "32px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
})

// Sign up link
const SignUpText = styled(Typography)({
  color: "white",
  textAlign: "center",
})

const SignUpLink = styled(Link)({
  color: "white",
  fontWeight: "bold",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
})

export default function Login() {
  const navigate = useNavigate()

  // Add switch state for job seeker/employer
  const [isEmployer, setIsEmployer] = useState(false)

  // State
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // 'success', 'error', 'warning', 'info'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Friendly error mapping
  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/user-not-found":
        return "No account found with this email."
      case "auth/wrong-password":
        return "Incorrect password."
      case "auth/invalid-email":
        return "Invalid email format."
      case "auth/popup-closed-by-user":
        return "Sign-in popup closed before completing sign in."
      case "auth/cancelled-popup-request":
        return "Only one popup request is allowed at a time."
      default:
        return "Authentication failed. Please try again."
    }
  }

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })

    // Clear error when field is changed
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      })
    }
  }

  // Close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    })
  }

  // Validate form
  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Email/password login handler
  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setNotification({
        open: true,
        message: "Please fill in all required fields correctly",
        severity: "error",
      })
      return
    }

    setIsSubmitting(true)
    setErrors({ email: "", password: "" })
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      if (isEmployer) {
        // Check if user exists in employer table
        const q = query(collection(db, "employers"), where("uid", "==", user.uid))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          setNotification({
            open: true,
            message: "Login successful! Redirecting to employer dashboard...",
            severity: "success",
          })
          setTimeout(() => navigate("/employer-dashboard"), 1200)
        } else {
          setNotification({
            open: true,
            message: "No employer account found for this email. Please check your login type.",
            severity: "error",
          })
        }
      } else {
        setNotification({
          open: true,
          message: "Login successful! Redirecting to dashboard...",
          severity: "success",
        })
        setTimeout(() => navigate("/user-dashboard"), 1200)
      }
    } catch (err) {
      const friendly = getFriendlyError(err.code)
      setNotification({
        open: true,
        message: friendly,
        severity: "error",
      })
      // map backend error to field if possible
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-email") {
        setErrors((prev) => ({ ...prev, email: friendly }))
      } else if (err.code === "auth/wrong-password") {
        setErrors((prev) => ({ ...prev, password: friendly }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Google login handler
  const handleGoogleSignIn = async () => {
    setErrors({ email: "", password: "" })
    setIsSubmitting(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      if (isEmployer) {
        // Check if user exists in employer table
        const q = query(collection(db, "employers"), where("uid", "==", user.uid))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          setNotification({
            open: true,
            message: "Login successful! Redirecting to employer dashboard...",
            severity: "success",
          })
          setTimeout(() => navigate("/employer-dashboard"), 1200)
        } else {
          setNotification({
            open: true,
            message: "No employer account found for this email. Please check your login type.",
            severity: "error",
          })
        }
      } else {
        setNotification({
          open: true,
          message: "Login successful! Redirecting to dashboard...",
          severity: "success",
        })
        setTimeout(() => navigate("/user-dashboard"), 1200)
      }
    } catch (err) {
      setNotification({
        open: true,
        message: getFriendlyError(err.code),
        severity: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
              {isEmployer ? "Login as Employer" : "Login as Job Seeker"}
            </Typography>
          }
          sx={{ mb: 2, justifyContent: "center", width: "100%" }}
        />

        <Title>Login - Welcome Back</Title>
        <Subtitle>Glad to see you again 👋</Subtitle>
        <Subtitle>Login to see your Account below</Subtitle>
        <Divider />

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <FieldLabel>Email</FieldLabel>
          <InputField
            fullWidth
            placeholder="example@gmail.com"
            variant="outlined"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />

          <FieldLabel>Password</FieldLabel>
          <InputField
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            variant="outlined"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                    sx={{ color: "white" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <ForgotPasswordLink to="/forgot-password">Forget Password?</ForgotPasswordLink>

          <LoginButton
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </LoginButton>

          <GoogleButton
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& .MuiButton-startIcon": {
                marginRight: "8px",
                marginLeft: 0,
              },
            }}
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : `Continue with Google`}
          </GoogleButton>

          <SignUpText>
            Don't have an Account?{" "}
            <SignUpLink to="/signup">{isEmployer ? "Sign up as Employer" : "Sign up for free"}</SignUpLink>
          </SignUpText>
        </form>

        {/* Notification */}
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
  )
}