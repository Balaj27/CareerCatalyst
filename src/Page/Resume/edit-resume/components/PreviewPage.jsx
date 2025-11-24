import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";

function PreviewPage() {
  const resumeData = useSelector((state) => state.editResume.resumeData);
  const selectedTemplate = resumeData?.template || "modern";
  
  useEffect(() => {
    console.log("PreviewPage rendered with template:", selectedTemplate);
  }, [resumeData, selectedTemplate]);
  
  return (
    <Box>
      {selectedTemplate === "classic" ? (
        <ClassicTemplate resumeData={resumeData} />
      ) : (
        <ModernTemplate resumeData={resumeData} />
      )}
    </Box>
  );
}

export default PreviewPage;