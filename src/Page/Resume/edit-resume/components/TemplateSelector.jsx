import React from "react";
import { Box, Card, CardContent, Typography, Radio, Grid, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateResumeData } from "../../../../features/resume/resumeFeatures";

const templates = [
  {
    id: "modern",
    name: "Modern Template",
    description: "Clean and contemporary design with a top border accent",
    preview: "Top border with centered header and organized sections",
  },
  {
    id: "classic",
    name: "Classic Template",
    description: "Traditional two-column layout with sidebar",
    preview: "Sidebar layout with professional appearance",
  },
];

function TemplateSelector() {
  const dispatch = useDispatch();
  const resumeData = useSelector((state) => state.editResume.resumeData);
  const selectedTemplate = resumeData?.template || "modern";

  const handleTemplateChange = (templateId) => {
    dispatch(updateResumeData({ template: templateId }));
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Choose Template
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select a template style for your resume
      </Typography>
      
      <Grid container spacing={2}>
        {templates.map((template) => (
          <Grid item xs={12} sm={6} key={template.id}>
            <Card
              sx={{
                cursor: "pointer",
                border: selectedTemplate === template.id ? 2 : 1,
                borderColor: selectedTemplate === template.id ? "primary.main" : "divider",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                },
              }}
              onClick={() => handleTemplateChange(template.id)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {template.description}
                    </Typography>
                  </Box>
                  <Radio
                    checked={selectedTemplate === template.id}
                    value={template.id}
                    onChange={() => handleTemplateChange(template.id)}
                  />
                </Box>
                
                {/* Template Preview Mockup */}
                <Paper
                  elevation={0}
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "action.hover",
                    borderRadius: 1,
                    minHeight: 120,
                  }}
                >
                  {template.id === "modern" ? (
                    <Box>
                      <Box sx={{ borderTop: "4px solid", borderColor: "primary.main", mb: 1 }} />
                      <Box sx={{ textAlign: "center", mb: 1 }}>
                        <Typography variant="caption" fontWeight="bold">Name</Typography>
                        <Typography variant="caption" display="block">Job Title</Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                        <Box sx={{ height: 4, bgcolor: "action.active", width: "60%" }} />
                        <Box sx={{ height: 4, bgcolor: "action.active", width: "80%" }} />
                        <Box sx={{ height: 4, bgcolor: "action.active", width: "70%" }} />
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Box sx={{ width: "30%", display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Box sx={{ height: 4, bgcolor: "action.active", width: "100%" }} />
                        <Box sx={{ height: 4, bgcolor: "action.active", width: "80%" }} />
                        <Box sx={{ height: 4, bgcolor: "action.active", width: "90%" }} />
                      </Box>
                      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Typography variant="caption" fontWeight="bold">Name</Typography>
                        <Box sx={{ height: 4, bgcolor: "action.active", width: "70%" }} />
                        <Box sx={{ height: 4, bgcolor: "action.active", width: "85%" }} />
                        <Box sx={{ height: 4, bgcolor: "action.active", width: "60%" }} />
                      </Box>
                    </Box>
                  )}
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default TemplateSelector;
