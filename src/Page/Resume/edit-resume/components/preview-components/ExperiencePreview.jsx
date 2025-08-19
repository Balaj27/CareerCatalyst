import React from "react";
import { Box, Typography, Divider } from "@mui/material";

function ExperiencePreview({ resumeInfo }) {
  return (
    <Box my={6}>
      {resumeInfo?.experience.length > 0 && (
        <Box mb={2}>
          <Typography
            variant="subtitle1"
            align="center"
            fontWeight="bold"
            sx={{ color: resumeInfo?.themeColor }}
          >
            Professional Experience
          </Typography>
          <Divider sx={{ borderColor: resumeInfo?.themeColor }} />
        </Box>
      )}

      {resumeInfo?.experience?.map((experience, index) => (
        <Box key={index} my={3}>
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{ color: resumeInfo?.themeColor }}
          >
            {experience?.title}
          </Typography>

          <Typography
            variant="body2"
            display="flex"
            justifyContent="space-between"
          >
            <span>
              {experience?.companyName}
              {experience?.companyName && experience?.city ? ", " : ""}
              {experience?.city}
              {experience?.city && experience?.state ? ", " : ""}
              {experience?.state}
            </span>
            <span>
              {experience?.startDate}{" "}
              {experience?.startDate && experience?.currentlyWorking
                ? " - Present"
                : experience?.endDate
                ? ` - ${experience?.endDate}`
                : ""}
            </span>
          </Typography>

          <Box
            mt={1}
            sx={{ fontSize: "0.875rem" }}
            dangerouslySetInnerHTML={{ __html: experience?.workSummary }}
          />
        </Box>
      ))}
    </Box>
  );
}

export default ExperiencePreview;
