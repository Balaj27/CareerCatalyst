import React, { useEffect } from "react";
import ResumeForm from "../components/ResumeForm";
import PreviewPage from "../components/PreviewPage";
import { useParams } from "react-router-dom";
import { getResumeData } from "../../../../Services/resumeAPI";
import { useDispatch, useSelector } from "react-redux";
import { addResumeData } from "../../../../features/resume/resumeFeatures";
import { Box } from "@mui/material";
import Navbar from "../../../../components/landing-page/Navbar";

export function EditResume() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const resumeInfo = useSelector((state) => state.editResume.resumeData);

  useEffect(() => {
    // Only fetch if Redux doesn't have data or has the wrong resume loaded
    if (
      resume_id &&
      (!resumeInfo || !resumeInfo.id || resumeInfo.id !== resume_id)
    ) {
      getResumeData(resume_id)
        .then((data) => {
          dispatch(addResumeData(data));
        })
        .catch(err => {
          // Optionally show a toast or redirect
        });
    }
  }, [resume_id, dispatch, resumeInfo]);

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