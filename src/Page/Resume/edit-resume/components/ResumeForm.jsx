import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { Home, ExpandMore as ExpandMoreIcon, Edit as EditIcon } from "@mui/icons-material";
import PersonalDetails from "./form-components/PersonalDetails";
import Summary from "./form-components/Summary";
import Experience from "./form-components/Experience";
import Education from "./form-components/Education";
import Skills from "./form-components/Skills";
import Project from "./form-components/Project";
import ThemeColor from "./ThemeColor";
import { setResumeId, setResumeData } from "../../../../features/resume/resumeFeatures";
import { getResumeData, createNewResume } from "../../../../Services/resumeAPI";
import { getUserProfileData, convertProfileToResumeData } from "../../../../Services/userProfileAPI";

// Custom colors based on the image
const mainGreen = "linear-gradient(90deg, #16382C 0%, #225144 100%)";
const darkGreen = "#16382C";
const midGreen = "#225144";
const lightGreen = "#2D6F5B";
const white = "#fff";
const borderRadius = "16px";

function isValidResumeId(id) {
  return typeof id === "string" && id.trim().length > 0;
}

function ResumeForm() {
  const resumeInfo = useSelector((state) => state.editResume.resumeData);
  const resumeIdFromStore = useSelector((state) => state.editResume.resumeId);

  const dispatch = useDispatch();
  const { resumeId, resume_id } = useParams();
  const navigate = useNavigate();

  // Debug logging
  console.log("ResumeForm render - resumeInfo:", resumeInfo);
  console.log("ResumeForm render - resumeIdFromStore:", resumeIdFromStore);

  // Debug function to test profile loading
  const testProfileLoading = async () => {
    try {
      console.log("Testing profile loading...");
      const profileData = await getUserProfileData();
      console.log("Profile data loaded:", profileData);
      const resumeData = convertProfileToResumeData(profileData);
      console.log("Converted resume data:", resumeData);
      console.log("Dispatching setResumeData with:", resumeData);
      dispatch(setResumeData(resumeData));
      console.log("setResumeData dispatched");
    } catch (error) {
      console.error("Error in test profile loading:", error);
    }
  };

  // Only one section open at a time (default: first section)
  const [expanded, setExpanded] = useState("personal");
  const isMobile = useMediaQuery("(max-width:600px)");

  // Use useRef to track if we've already loaded data
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const id = resumeId || resume_id;
    console.log("ResumeForm useEffect - ID:", id, "resumeIdFromStore:", resumeIdFromStore, "hasLoaded:", hasLoadedRef.current);
    
    // Prevent multiple loads
    if (hasLoadedRef.current) {
      console.log("Already loaded data, skipping...");
      return;
    }
    
    if (isValidResumeId(id)) {
      console.log("Loading existing resume:", id);
      hasLoadedRef.current = true;
      dispatch(setResumeId(id));
      getResumeData(id).then(data => {
        console.log("Loaded resume data:", data);
        if (data) dispatch(setResumeData(data));
      })
      .catch(err => {
        console.error("Error loading resume:", err);
        hasLoadedRef.current = false; // Reset on error
      });
    } else if (!resumeIdFromStore) {
      console.log("Creating new resume with profile data");
      hasLoadedRef.current = true;
      // Create new resume with user profile data auto-filled
      const createResumeWithProfileData = async () => {
        try {
          // Get user profile data
          const profileData = await getUserProfileData();
          console.log("Profile data loaded:", profileData);
          const resumeData = convertProfileToResumeData(profileData);
          console.log("Converted resume data:", resumeData);
          
          // Create new resume with profile data
          const newResume = await createNewResume(resumeData);
          console.log("Created new resume:", newResume);
          if (isValidResumeId(newResume?.id)) {
            dispatch(setResumeId(newResume.id));
            dispatch(setResumeData(newResume));
          }
        } catch (error) {
          console.error("Error loading profile data:", error);
          hasLoadedRef.current = false; // Reset on error
          // Fallback to empty resume if profile loading fails
          createNewResume({}).then(newResume => {
            console.log("Created fallback resume:", newResume);
            if (isValidResumeId(newResume?.id)) {
              dispatch(setResumeId(newResume.id));
              dispatch(setResumeData(newResume));
            }
          });
        }
      };
      
      createResumeWithProfileData();
    }
  }, [resumeId, resume_id, resumeIdFromStore]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Style helpers
  const sectionSx = {
    background: mainGreen,
    color: white,
    borderRadius,
    mb: 2,
    boxShadow: "0 4px 12px rgba(22,56,44,0.08)",
    "& .MuiAccordionSummary-root": {
      minHeight: "56px"
    }
  };
  const sectionTitleSx = {
    fontWeight: 700,
    fontSize: "1.1rem",
    display: "flex",
    alignItems: "center"
  };

  const infoCardSx = {
    background: mainGreen,
    color: white,
    borderRadius,
    p: 2,
    mb: 2,
    display: "flex",
    alignItems: "center",
    gap: 2,
    flexDirection: isMobile ? "column" : "row"
  };
  
  return (
    <Box sx={{ maxWidth: 570, mx: "auto", pt: 4 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Link to="/dashboard">
            <Button
              variant="contained"
              sx={{
                minWidth: 0,
                p: 1,
                background: darkGreen,
                color: white,
                borderRadius: "10px"
              }}
            >
              <Home fontSize="small" />
            </Button>
          </Link>
          <ThemeColor resumeInfo={resumeInfo} />
        </Stack>
        <Stack direction="row" spacing={2}>
          {/* Debug button - remove in production */}
          <Button
            variant="outlined"
            sx={{
              borderColor: lightGreen,
              color: lightGreen,
              borderRadius: "8px",
              px: 2,
              fontWeight: 700,
              "&:hover": { 
                borderColor: midGreen,
                backgroundColor: "rgba(45, 111, 91, 0.1)"
              },
              textTransform: "none"
            }}
            onClick={testProfileLoading}
          >
            Test Profile Load
          </Button>
          <Button
            variant="contained"
            sx={{
              background: lightGreen,
              color: white,
              borderRadius: "8px",
              px: 3,
              fontWeight: 700,
              "&:hover": { background: midGreen },
              textTransform: "none"
            }}
            onClick={() => navigate(`/view-resumes/${resumeId || resume_id || resumeIdFromStore}`)}
          >
            View Resume
          </Button>
        </Stack>
      </Stack>

      {/* Accordions/Sections */}
      <Box>
        <Accordion sx={sectionSx} expanded={expanded === "personal"} onChange={handleAccordionChange("personal")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: white }} />}>
            <Typography sx={sectionTitleSx}>
              <span style={{ fontSize: 22, marginRight: 8 }}>👤</span>
              Personal Details
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ background: darkGreen, borderRadius: "0 0 16px 16px", p: 2 }}>
            <PersonalDetails resumeInfo={resumeInfo} />
          </AccordionDetails>
        </Accordion>
        <Accordion sx={sectionSx} expanded={expanded === "summary"} onChange={handleAccordionChange("summary")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: white }} />}>
            <Typography sx={sectionTitleSx}>
              <span style={{ fontSize: 22, marginRight: 8 }}>📝</span>
              Summary
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ background: darkGreen, borderRadius: "0 0 16px 16px", p: 2 }}>
            <Summary resumeInfo={resumeInfo} />
          </AccordionDetails>
        </Accordion>
        <Accordion sx={sectionSx} expanded={expanded === "experience"} onChange={handleAccordionChange("experience")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: white }} />}>
            <Typography sx={sectionTitleSx}>
              <span style={{ fontSize: 22, marginRight: 8 }}>💼</span>
              Experience
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ background: darkGreen, borderRadius: "0 0 16px 16px", p: 2 }}>
            <Experience resumeInfo={resumeInfo} />
          </AccordionDetails>
        </Accordion>
        <Accordion sx={sectionSx} expanded={expanded === "project"} onChange={handleAccordionChange("project")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: white }} />}>
            <Typography sx={sectionTitleSx}>
              <span style={{ fontSize: 22, marginRight: 8 }}>📂</span>
              Projects
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ background: darkGreen, borderRadius: "0 0 16px 16px", p: 2 }}>
            <Project resumeInfo={resumeInfo} />
          </AccordionDetails>
        </Accordion>
        <Accordion sx={sectionSx} expanded={expanded === "education"} onChange={handleAccordionChange("education")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: white }} />}>
            <Typography sx={sectionTitleSx}>
              <span style={{ fontSize: 22, marginRight: 8 }}>🎓</span>
              Education
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ background: darkGreen, borderRadius: "0 0 16px 16px", p: 2 }}>
            <Education resumeInfo={resumeInfo} />
          </AccordionDetails>
        </Accordion>
        <Accordion sx={sectionSx} expanded={expanded === "skills"} onChange={handleAccordionChange("skills")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: white }} />}>
            <Typography sx={sectionTitleSx}>
              <span style={{ fontSize: 22, marginRight: 8 }}>🛠️</span>
              Skills
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ background: darkGreen, borderRadius: "0 0 16px 16px", p: 2 }}>
            <Skills resumeInfo={resumeInfo} />
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}

export default ResumeForm;