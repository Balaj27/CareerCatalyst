import React from 'react';
import { Typography } from '@mui/material';

function SummeryPreview({ resumeInfo }) {
  return (
    <Typography variant="caption">
      {resumeInfo?.summary}
    </Typography>
  );
}

export default SummeryPreview;
