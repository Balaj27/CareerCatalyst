import React, { useEffect } from "react";
import ResumeForm from "../components/ResumeForm";
import PreviewPage from "../components/PreviewPage";
import { useParams } from "react-router-dom";
import { getResumeData } from "../../../../Services/resumeAPI";
import { useDispatch, useSelector } from "react-redux";
import { setResumeId, setResumeData } from "../../../../features/resume/resumeFeatures";
import { Box } from "@mui/material";
import Navbar from "../../../../components/landing-page/Navbar";

export function EditResume() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const resumeInfo = useSelector((state) => state.editResume.resumeData);

  useEffect(() => {
    // Always fetch data on component mount to ensure fresh data
    if (resume_id) {
      dispatch(setResumeId(resume_id));
      getResumeData(resume_id)
        .then((data) => {
          if (data) {
            console.log("Loaded resume data:", data); // Debug log
            dispatch(setResumeData(data));
          }
        })
        .catch(err => {
          console.error("Error fetching resume data:", err);
          // Optionally show a toast or redirect
        });
    }
  }, [resume_id, dispatch]);

  return (
    <>
      <Navbar />
      <Box display="flex" flexDirection="row" gap={4} p={4} width="100%">
        <Box flex={1}>
          <ResumeForm />
        </Box>
        <Box flex={1}>
          <PreviewPage />
        </Box>
      </Box>
    </>
  );
}

export default EditResume;