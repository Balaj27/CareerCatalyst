import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material"
import { Link, useLocation, useNavigate } from "react-router-dom"

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

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const emailFromState = location.state?.email || ""

  const [formData, setFormData] = useState({
    email: emailFromState,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required"
    } else if (formData.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits"
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required"
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setNotification({
        open: true,
        message: "Please fill in all fields correctly",
        severity: "error",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:5001/verify-otp-and-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setNotification({
          open: true,
          message: "Password reset successfully! Redirecting to login...",
          severity: "success",
        })
        
        // Navigate to login page after 2 seconds
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setNotification({
          open: true,
          message: data.error || "Failed to reset password. Please try again.",
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
        <BackLink to="/forgot-password">
          <ArrowBack />
          Back
        </BackLink>

        <Title>Reset Password</Title>
        <Subtitle>Enter the OTP sent to your email and create a new password</Subtitle>
        <Divider />

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <FieldLabel>Email Address</FieldLabel>
          <InputField
            fullWidth
            placeholder="example@gmail.com"
            variant="outlined"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            disabled={isSubmitting || !!emailFromState}
          />

          <FieldLabel>OTP (6 digits)</FieldLabel>
          <InputField
            fullWidth
            placeholder="Enter 6-digit OTP"
            variant="outlined"
            type="text"
            value={formData.otp}
            onChange={(e) => {
              // Only allow numbers and limit to 6 digits
              const value = e.target.value.replace(/\D/g, "").slice(0, 6)
              handleChange("otp", value)
            }}
            error={!!errors.otp}
            helperText={errors.otp}
            disabled={isSubmitting}
            inputProps={{ maxLength: 6 }}
          />

          <FieldLabel>New Password</FieldLabel>
          <InputField
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            variant="outlined"
            value={formData.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            disabled={isSubmitting}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: "white" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FieldLabel>Confirm New Password</FieldLabel>
          <InputField
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            variant="outlined"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            disabled={isSubmitting}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{ color: "white" }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <SubmitButton
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={24} sx={{ color: "white", mr: 1 }} />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
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
