import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { ArrowBack } from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"

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

const FieldLabel = styled(Typography)({
  fontSize: "16px",
  color: "white",
  marginBottom: "8px",
  alignSelf: "flex-start",
  width: "100%",
})

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
  "& .MuiFormHelperText-root": {
    color: "#f44336",
    marginLeft: 0,
  },
  width: "100%",
  marginBottom: "24px",
}))

const SubmitButton = styled(Button)({
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

const BackLink = styled(Link)({
  color: "white",
  textDecoration: "none",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  alignSelf: "flex-start",
  marginBottom: "16px",
  "&:hover": {
    textDecoration: "underline",
  },
})

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:5001/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setNotification({
          open: true,
          message: "OTP sent successfully! Check your email.",
          severity: "success",
        })
        
        // Navigate to reset password page after 2 seconds
        setTimeout(() => {
          navigate("/reset-password", { state: { email } })
        }, 2000)
      } else {
        setNotification({
          open: true,
          message: data.error || "Failed to send OTP. Please try again.",
          severity: "error",
        })
      }
    } catch (err) {
      setNotification({
        open: true,
        message: "Network error. Please check your connection and try again.",
        severity: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    })
  }

  return (
    <PageWrapper>
      <FormWrapper>
        <BackLink to="/login">
          <ArrowBack />
          Back to Login
        </BackLink>

        <Title>Forgot Password</Title>
        <Subtitle>Enter your email to receive a password reset OTP</Subtitle>
        <Divider />

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <FieldLabel>Email Address</FieldLabel>
          <InputField
            fullWidth
            placeholder="example@gmail.com"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError("")
            }}
            error={!!error}
            helperText={error}
            disabled={isSubmitting}
          />

          <SubmitButton
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={24} sx={{ color: "white", mr: 1 }} />
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </SubmitButton>

          <Typography sx={{ color: "white", textAlign: "center", mt: 2 }}>
            Remember your password?{" "}
            <Link
              to="/login"
              style={{
                color: "white",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </Typography>
        </form>

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
