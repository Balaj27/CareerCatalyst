import React from "react";
import { Box, Typography, Divider } from "@mui/material";

function ModernTemplate({ resumeData }) {
  return (
    <Box
      sx={{
        boxShadow: 3,
        height: "100%",
        padding: 7,
        borderTop: "20px solid",
        borderColor: resumeData?.themeColor || "#000000",
      }}
    >
      {/* Personal Details */}
      <Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          align="center"
          sx={{ color: resumeData?.themeColor }}
        >
          {resumeData?.personal?.firstName} {resumeData?.personal?.lastName}
        </Typography>

        <Typography variant="subtitle2" align="center" fontWeight={500}>
          {resumeData?.personal?.jobTitle}
        </Typography>

        <Typography
          variant="caption"
          align="center"
          display="block"
          sx={{ color: resumeData?.themeColor }}
        >
          {resumeData?.personal?.address}
        </Typography>

        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography variant="caption" sx={{ color: resumeData?.themeColor }}>
            {resumeData?.personal?.phone}
          </Typography>
          <Typography variant="caption" sx={{ color: resumeData?.themeColor }}>
            {resumeData?.personal?.email}
          </Typography>
        </Box>

        <Divider
          sx={{
            my: 2,
            borderWidth: "1.5px",
            borderColor: resumeData?.themeColor,
          }}
        />
      </Box>

      {/* Summary */}
      {resumeData?.summary && (
        <Box my={6}>
          <Box mb={2}>
            <Typography
              variant="subtitle1"
              align="center"
              fontWeight="bold"
              sx={{ color: resumeData?.themeColor }}
            >
              Summary
            </Typography>
            <Divider sx={{ borderColor: resumeData?.themeColor }} />
          </Box>
          <Typography variant="body2">{resumeData.summary}</Typography>
        </Box>
      )}

      {/* Experience */}
      {resumeData?.experience && resumeData.experience.length > 0 && (
        <Box my={6}>
          <Box mb={2}>
            <Typography
              variant="subtitle1"
              align="center"
              fontWeight="bold"
              sx={{ color: resumeData?.themeColor }}
            >
              Professional Experience
            </Typography>
            <Divider sx={{ borderColor: resumeData?.themeColor }} />
          </Box>

          {resumeData.experience.map((experience, index) => (
            <Box key={index} my={3}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ color: resumeData?.themeColor }}
              >
                {experience?.title}
              </Typography>

              <Typography variant="body2" display="flex" justifyContent="space-between">
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
      )}

      {/* Projects */}
      {resumeData?.projects && resumeData.projects.length > 0 && (
        <Box my={6}>
          <Box mb={2}>
            <Typography
              variant="subtitle1"
              align="center"
              fontWeight="bold"
              sx={{ color: resumeData?.themeColor }}
            >
              Projects
            </Typography>
            <Divider sx={{ borderColor: resumeData?.themeColor }} />
          </Box>

          {resumeData.projects.map((project, index) => (
            <Box key={index} my={3}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ color: resumeData?.themeColor }}
              >
                {project?.title}
              </Typography>

              <Box
                mt={1}
                sx={{ fontSize: "0.875rem" }}
                dangerouslySetInnerHTML={{ __html: project?.description }}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Education */}
      {resumeData?.education && resumeData.education.length > 0 && (
        <Box my={6}>
          <Box mb={2}>
            <Typography
              variant="subtitle1"
              align="center"
              fontWeight="bold"
              sx={{ color: resumeData?.themeColor }}
            >
              Education
            </Typography>
            <Divider sx={{ borderColor: resumeData?.themeColor }} />
          </Box>

          {resumeData.education.map((education, index) => (
            <Box key={index} my={3}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ color: resumeData?.themeColor }}
              >
                {education?.degree}
              </Typography>

              <Typography variant="body2" display="flex" justifyContent="space-between">
                <span>{education?.universityName}</span>
                <span>
                  {education?.startDate}
                  {education?.endDate && ` - ${education.endDate}`}
                </span>
              </Typography>

              {education?.description && (
                <Typography variant="body2" mt={1}>
                  {education.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Skills */}
      {resumeData?.skills && resumeData.skills.length > 0 && (
        <Box my={6}>
          <Box mb={2}>
            <Typography
              variant="subtitle1"
              align="center"
              fontWeight="bold"
              sx={{ color: resumeData?.themeColor }}
            >
              Skills
            </Typography>
            <Divider sx={{ borderColor: resumeData?.themeColor }} />
          </Box>

          <Box display="flex" flexWrap="wrap" gap={2}>
            {resumeData.skills.map((skill, index) => (
              <Box key={index} flex="1 1 45%">
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">{skill?.name}</Typography>
                  <Typography variant="body2">{skill?.rating}/5</Typography>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    bgcolor: "action.hover",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${(skill?.rating / 5) * 100}%`,
                      height: "100%",
                      bgcolor: resumeData?.themeColor || "#000",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ModernTemplate;
