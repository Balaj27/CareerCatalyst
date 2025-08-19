import React from "react";
import { Box, Typography, Divider, Grid, LinearProgress } from "@mui/material";

function SkillsPreview({ resumeInfo }) {
  return (
    <Box my={6}>
      {resumeInfo?.skills.length > 0 && (
        <Box>
          <Typography
            align="center"
            variant="subtitle2"
            fontWeight="bold"
            mb={1}
            sx={{ color: resumeInfo?.themeColor }}
          >
            Skills
          </Typography>
          <Divider sx={{ borderColor: resumeInfo?.themeColor }} />
        </Box>
      )}

      <Grid container spacing={2} mt={2}>
        {resumeInfo?.skills.map((skill, index) => (
          <Grid item xs={6} key={index}>
            {skill?.name && (
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="caption">{skill.name}</Typography>
                <Box width="50%" ml={1}>
                  <Box
                    sx={{
                      height: 8,
                      backgroundColor: "#e0e0e0",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${skill?.rating * 20}%`,
                        backgroundColor: resumeInfo.themeColor,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SkillsPreview;
