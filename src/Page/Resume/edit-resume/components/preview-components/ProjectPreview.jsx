import React from "react";
import { Box, Typography, Divider } from "@mui/material";

function ProjectPreview({ resumeInfo }) {
  return (
    <Box my={6}>
      {resumeInfo?.projects?.length > 0 && (
        <Box>
          <Typography
            align="center"
            variant="subtitle2"
            fontWeight="bold"
            mb={1}
            sx={{ color: resumeInfo?.themeColor }}
          >
            Personal Project
          </Typography>
          <Divider sx={{ borderColor: resumeInfo?.themeColor }} />
        </Box>
      )}

      {resumeInfo?.projects?.map((project, index) => (
        <Box key={index} my={3}>
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{ color: resumeInfo?.themeColor }}
          >
            {project?.projectName}
          </Typography>

          {project?.techStack?.trim() && (
            <Typography variant="caption">
              Tech Stack: {project.techStack.split(",").join(" | ")}
            </Typography>
          )}

          {project?.projectSummary?.trim() && (
            <Box
              mt={1}
              sx={{ fontSize: "0.75rem" }}
              dangerouslySetInnerHTML={{ __html: project.projectSummary }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
}

export default ProjectPreview;
