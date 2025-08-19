import React from "react";
import { Box, Typography, Divider } from "@mui/material";

function PersonalDeatailPreview({ resumeInfo }) {
  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        sx={{ color: resumeInfo?.themeColor }}
      >
        {resumeInfo?.personal?.firstName} {resumeInfo?.personal?.lastName}
      </Typography>

      <Typography
        variant="subtitle2"
        align="center"
        fontWeight={500}
      >
        {resumeInfo?.personal?.jobTitle}
      </Typography>

      <Typography
        variant="caption"
        align="center"
        display="block"
        sx={{ color: resumeInfo?.themeColor }}
      >
        {resumeInfo?.personal?.address}
      </Typography>

      <Box display="flex" justifyContent="space-between" mt={1}>
        <Typography variant="caption" sx={{ color: resumeInfo?.themeColor }}>
          {resumeInfo?.personal?.phone}
        </Typography>
        <Typography variant="caption" sx={{ color: resumeInfo?.themeColor }}>
          {resumeInfo?.personal?.email}
        </Typography>
      </Box>

      <Divider
        sx={{
          my: 2,
          borderWidth: "1.5px",
          borderColor: resumeInfo?.themeColor,
        }}
      />
    </Box>
  );
}

export default PersonalDeatailPreview;
