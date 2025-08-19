import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "../../../../../features/resume/resumeFeatures";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Avatar,
  InputAdornment,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { updateThisResume } from "../../../../../Services/resumeAPI";
import { toast } from "sonner";
import { Email, Phone, LocationOn, Work } from "@mui/icons-material";

// Theme colors based on the reference image
const mainGreen = "linear-gradient(90deg, #16382C 0%, #225144 100%)";
const darkGreen = "#16382C";
const midGreen = "#225144";
const lightGreen = "#2D6F5B";
const white = "#fff";
const borderRadius = "16px";

function PersonalDetails({ resumeInfo }) {
  const { resumeId, resume_id } = useParams();
  const resolvedResumeId = resumeId || resume_id;
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    address: "",
    phone: "",
    email: "",
  });
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  // Auto-fill only ONCE when resumeInfo.personal is available
  useEffect(() => {
    if (
      resumeInfo &&
      resumeInfo.personal &&
      !hasAutoFilled &&
      (
        resumeInfo.personal.firstName ||
        resumeInfo.personal.lastName ||
        resumeInfo.personal.jobTitle ||
        resumeInfo.personal.address ||
        resumeInfo.personal.phone ||
        resumeInfo.personal.email
      )
    ) {
      setFormData({
        firstName: resumeInfo.personal.firstName || "",
        lastName: resumeInfo.personal.lastName || "",
        jobTitle: resumeInfo.personal.jobTitle || "",
        address: resumeInfo.personal.address || "",
        phone: resumeInfo.personal.phone || "",
        email: resumeInfo.personal.email || "",
      });
      setHasAutoFilled(true);
    }
  }, [resumeInfo, hasAutoFilled]);

  const isFormValid =
    (formData.firstName || "").trim() &&
    (formData.lastName || "").trim() &&
    (formData.address || "").trim() &&
    (formData.phone || "").trim() &&
    (formData.email || "").trim();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    dispatch(
      addResumeData({
        ...resumeInfo,
        personal: { ...resumeInfo.personal, [name]: value },
      })
    );
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast("Please fill all required fields", { type: "error" });
      return;
    }
    if (!resolvedResumeId) {
      toast("No resume selected", { type: "error" });
      return;
    }
    setLoading(true);
    try {
      await updateThisResume(resolvedResumeId, { personal: formData });
      toast("Personal details saved", { type: "success" });
    } catch (error) {
      toast(error.message || "Failed to save personal details", { type: "error" });
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Profile Card style
  const cardSx = {
    background: mainGreen,
    color: white,
    borderRadius,
    p: 3,
    mb: 3,
    boxShadow: "0 4px 12px rgba(22,56,44,0.12)",
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: "center",
    gap: 3,
  };

  return (
    <Box>
      {/* Profile Card */}
      <Box sx={cardSx}>
        <Box flex={1}>
          <Typography fontWeight={700} fontSize="1.15rem" sx={{ letterSpacing: 0.2 }}>
            {formData.firstName || "First Name"} {formData.lastName || "Last Name"}
          </Typography>
          <Typography fontSize="1rem" sx={{ color: "rgba(255,255,255,0.85)" }}>
            {formData.jobTitle || "Your Designation"}
          </Typography>
          <Grid container spacing={1} sx={{ mt: 1, color: "rgba(255,255,255,0.82)" }}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Email sx={{ fontSize: 18 }} />
                <Typography variant="body2">{formData.email || "email@domain.com"}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Phone sx={{ fontSize: 18 }} />
                <Typography variant="body2">{formData.phone || "Phone"}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOn sx={{ fontSize: 18 }} />
                <Typography variant="body2">{formData.address || "City, Country"}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Avatar
          alt={(formData.firstName || "") + " " + (formData.lastName || "")}
          src={resumeInfo?.personal?.avatar || ""}
          sx={{ width: 76, height: 76, border: `3px solid ${white}` }}
        />
      </Box>

      {/* Form */}
      <Box
        component="form"
        onSubmit={onSave}
        sx={{
          background: darkGreen,
          borderRadius,
          p: 3,
          boxShadow: "0 2px 8px rgba(22,56,44,0.10)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={1}
          sx={{ color: white, letterSpacing: 0.3 }}
        >
          Edit Personal Details
        </Typography>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="firstName"
              label="First Name"
              value={formData.firstName}
              required
              onChange={handleInputChange}
              error={(formData.firstName || "").trim() === ""}
              helperText={(formData.firstName || "").trim() === "" ? "First name is required" : ""}
              variant="filled"
              InputProps={{
                style: {
                  background: midGreen,
                  color: white,
                  borderRadius: "8px",
                },
              }}
              InputLabelProps={{
                style: { color: "#d0e7dd" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              required
              onChange={handleInputChange}
              error={(formData.lastName || "").trim() === ""}
              helperText={(formData.lastName || "").trim() === "" ? "Last name is required" : ""}
              variant="filled"
              InputProps={{
                style: {
                  background: midGreen,
                  color: white,
                  borderRadius: "8px",
                },
              }}
              InputLabelProps={{
                style: { color: "#d0e7dd" },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="jobTitle"
              label="Job Title"
              value={formData.jobTitle}
              onChange={handleInputChange}
              variant="filled"
              InputProps={{
                style: {
                  background: midGreen,
                  color: white,
                  borderRadius: "8px",
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <Work sx={{ color: "#d0e7dd" }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: "#d0e7dd" },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="address"
              label="Address"
              value={formData.address}
              required
              onChange={handleInputChange}
              error={(formData.address || "").trim() === ""}
              helperText={(formData.address || "").trim() === "" ? "Address is required" : ""}
              variant="filled"
              InputProps={{
                style: {
                  background: midGreen,
                  color: white,
                  borderRadius: "8px",
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ color: "#d0e7dd" }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: "#d0e7dd" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="phone"
              label="Phone"
              value={formData.phone}
              required
              onChange={handleInputChange}
              error={(formData.phone || "").trim() === ""}
              helperText={(formData.phone || "").trim() === "" ? "Phone is required" : ""}
              variant="filled"
              InputProps={{
                style: {
                  background: midGreen,
                  color: white,
                  borderRadius: "8px",
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ color: "#d0e7dd" }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: "#d0e7dd" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              value={formData.email}
              required
              onChange={handleInputChange}
              error={(formData.email || "").trim() === ""}
              helperText={(formData.email || "").trim() === "" ? "Email is required" : ""}
              variant="filled"
              InputProps={{
                style: {
                  background: midGreen,
                  color: white,
                  borderRadius: "8px",
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#d0e7dd" }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: "#d0e7dd" },
              }}
            />
          </Grid>
        </Grid>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            sx={{
              background: lightGreen,
              color: white,
              borderRadius: "8px",
              px: 4,
              fontWeight: 700,
              "&:hover": { background: midGreen },
              textTransform: "none",
            }}
            disabled={loading || !isFormValid}
            startIcon={loading && <CircularProgress size={20} sx={{ color: white }} />}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default PersonalDetails;