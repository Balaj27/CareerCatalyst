import React from "react";
import { Box, Typography, Divider } from "@mui/material";

function ClassicTemplate({ resumeData }) {
  return (
    <Box
      sx={{
        boxShadow: 3,
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* Left Sidebar */}
      <Box
        sx={{
          width: "35%",
          bgcolor: resumeData?.themeColor ? `${resumeData.themeColor}15` : "#f5f5f5",
          padding: 4,
          borderRight: `4px solid ${resumeData?.themeColor || "#000"}`,
        }}
      >
        {/* Contact Info */}
        <Box mb={4}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ color: resumeData?.themeColor, mb: 2 }}
          >
            CONTACT
          </Typography>
          <Divider sx={{ mb: 2, borderColor: resumeData?.themeColor }} />
          
          {resumeData?.personal?.phone && (
            <Box mb={1.5}>
              <Typography variant="caption" fontWeight="bold" display="block">
                Phone
              </Typography>
              <Typography variant="caption">{resumeData.personal.phone}</Typography>
            </Box>
          )}
          
          {resumeData?.personal?.email && (
            <Box mb={1.5}>
              <Typography variant="caption" fontWeight="bold" display="block">
                Email
              </Typography>
              <Typography variant="caption" sx={{ wordBreak: "break-all" }}>
                {resumeData.personal.email}
              </Typography>
            </Box>
          )}
          
          {resumeData?.personal?.address && (
            <Box>
              <Typography variant="caption" fontWeight="bold" display="block">
                Address
              </Typography>
              <Typography variant="caption">{resumeData.personal.address}</Typography>
            </Box>
          )}
        </Box>

        {/* Skills */}
        {resumeData?.skills && resumeData.skills.length > 0 && (
          <Box mb={4}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ color: resumeData?.themeColor, mb: 2 }}
            >
              SKILLS
            </Typography>
            <Divider sx={{ mb: 2, borderColor: resumeData?.themeColor }} />
            
            {resumeData.skills.map((skill, index) => (
              <Box key={index} mb={1.5}>
                <Typography variant="caption" fontWeight="bold" display="block">
                  {skill.name}
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: 6,
                    bgcolor: "action.hover",
                    borderRadius: 1,
                    mt: 0.5,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${skill.rating * 20}%`,
                      height: "100%",
                      bgcolor: resumeData?.themeColor || "#000",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* Education */}
        {resumeData?.education && resumeData.education.length > 0 && (
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ color: resumeData?.themeColor, mb: 2 }}
            >
              EDUCATION
            </Typography>
            <Divider sx={{ mb: 2, borderColor: resumeData?.themeColor }} />
            
            {resumeData.education.map((edu, index) => (
              <Box key={index} mb={2}>
                <Typography variant="caption" fontWeight="bold" display="block">
                  {edu.degree}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  {edu.universityName}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {edu.startDate} - {edu.endDate}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Right Main Content */}
      <Box sx={{ flex: 1, padding: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: resumeData?.themeColor }}
          >
            {resumeData?.personal?.firstName} {resumeData?.personal?.lastName}
          </Typography>
          <Typography
            variant="h6"
            fontWeight={500}
            sx={{ color: "text.secondary", mt: 0.5 }}
          >
            {resumeData?.personal?.jobTitle}
          </Typography>
        </Box>

        {/* Summary */}
        {resumeData?.summary && (
          <Box mb={4}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ color: resumeData?.themeColor, mb: 1 }}
            >
              PROFESSIONAL SUMMARY
            </Typography>
            <Divider sx={{ mb: 2, borderColor: resumeData?.themeColor }} />
            <Typography variant="body2">{resumeData.summary}</Typography>
          </Box>
        )}

        {/* Experience */}
        {resumeData?.experience && resumeData.experience.length > 0 && (
          <Box mb={4}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ color: resumeData?.themeColor, mb: 1 }}
            >
              PROFESSIONAL EXPERIENCE
            </Typography>
            <Divider sx={{ mb: 2, borderColor: resumeData?.themeColor }} />
            
            {resumeData.experience.map((exp, index) => (
              <Box key={index} mb={3}>
                <Typography variant="body2" fontWeight="bold">
                  {exp.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exp.companyName}
                  {exp.city && `, ${exp.city}`}
                  {exp.state && `, ${exp.state}`}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}
                </Typography>
                <Box
                  sx={{ fontSize: "0.875rem" }}
                  dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Projects */}
        {resumeData?.projects && resumeData.projects.length > 0 && (
          <Box mb={4}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ color: resumeData?.themeColor, mb: 1 }}
            >
              PROJECTS
            </Typography>
            <Divider sx={{ mb: 2, borderColor: resumeData?.themeColor }} />
            
            {resumeData.projects.map((project, index) => (
              <Box key={index} mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  {project.title}
                </Typography>
                <Box
                  sx={{ fontSize: "0.875rem", mt: 0.5 }}
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ClassicTemplate;
