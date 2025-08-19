import React from "react";
import { Box, Typography, Divider } from "@mui/material";

function EducationalPreview({ resumeInfo }) {
  return (
    <Box my={6}>
      {resumeInfo?.education.length > 0 && (
        <Box mb={2}>
          <Typography
            variant="subtitle1"
            align="center"
            fontWeight="bold"
            sx={{ color: resumeInfo?.themeColor }}
          >
            Education
          </Typography>
          <Divider sx={{ borderColor: resumeInfo?.themeColor }} />
        </Box>
      )}

      {resumeInfo?.education.map((education, index) => (
        <Box key={index} my={3}>
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{ color: resumeInfo?.themeColor }}
          >
            {education.universityName}
          </Typography>

          <Typography variant="body2" display="flex" justifyContent="space-between">
            <span>
              {education?.degree}
              {education?.degree && education?.major ? " in " : ""}
              {education?.major}
            </span>
            <span>
              {education?.startDate}
              {education?.startDate && education?.endDate ? " - " : ""}
              {education?.endDate}
            </span>
          </Typography>

          {education?.grade && (
            <Typography variant="body2">
              {education?.gradeType} - {education?.grade}
            </Typography>
          )}

          {education?.description && (
            <Typography variant="body2" mt={1}>
              {education.description}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}

export default EducationalPreview;
