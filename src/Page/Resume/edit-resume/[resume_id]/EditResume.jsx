import React, { useEffect, useState } from "react";
import ResumeForm from "../components/ResumeForm";
import PreviewPage from "../components/PreviewPage";
import { useParams } from "react-router-dom";
import { getResumeData } from "../../../../Services/resumeAPI";
import { useDispatch, useSelector } from "react-redux";
import { setResumeId, setResumeData } from "../../../../features/resume/resumeFeatures";
import { Box, Fab, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { Download, PictureAsPdf, Description, Print } from "@mui/icons-material";
import Navbar from "../../../../components/landing-page/Navbar";
import { exportToPDF, exportToDOCX, printResume } from "../../../../utils/resumeExport";
import { toast } from "sonner";

export function EditResume() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const resumeInfo = useSelector((state) => state.editResume.resumeData);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    // Always fetch data on component mount to ensure fresh data
    if (resume_id) {
      dispatch(setResumeId(resume_id));
      getResumeData(resume_id)
        .then((data) => {
          if (data) {
            console.log("Loaded resume data:", data); // Debug log
            dispatch(setResumeData(data));
          }
        })
        .catch(err => {
          console.error("Error fetching resume data:", err);
          // Optionally show a toast or redirect
        });
    }
  }, [resume_id, dispatch]);

  const handleDownloadClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDownloadPDF = async () => {
    handleCloseMenu();
    setDownloading(true);
    try {
      const filename = `${resumeInfo?.personal?.firstName || 'resume'}_${resumeInfo?.personal?.lastName || ''}_resume.pdf`.trim();
      const result = await exportToPDF('preview-container', filename);
      if (result.success) {
        toast.success('PDF downloaded successfully!');
      } else {
        toast.error('Failed to download PDF');
      }
    } catch (error) {
      toast.error('Error downloading PDF');
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadDOCX = async () => {
    handleCloseMenu();
    setDownloading(true);
    try {
      const filename = `${resumeInfo?.personal?.firstName || 'resume'}_${resumeInfo?.personal?.lastName || ''}_resume.docx`.trim();
      const result = await exportToDOCX(resumeInfo, filename);
      if (result.success) {
        toast.success('DOCX downloaded successfully!');
      } else {
        toast.error('Failed to download DOCX');
      }
    } catch (error) {
      toast.error('Error downloading DOCX');
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    handleCloseMenu();
    printResume();
  };

  return (
    <>
      <Navbar />
      <Box display="flex" flexDirection="row" gap={4} p={4} width="100%" position="relative">
        <Box flex={1}>
          <ResumeForm />
        </Box>
        <Box flex={1} id="preview-container">
          <PreviewPage />
        </Box>
        
        {/* Floating Download Button */}
        <Tooltip title="Download Resume">
          <Fab
            color="primary"
            onClick={handleDownloadClick}
            disabled={downloading}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              zIndex: 1000,
            }}
          >
            <Download />
          </Fab>
        </Tooltip>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleDownloadPDF}>
            <ListItemIcon>
              <PictureAsPdf fontSize="small" />
            </ListItemIcon>
            <ListItemText>Download as PDF</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDownloadDOCX}>
            <ListItemIcon>
              <Description fontSize="small" />
            </ListItemIcon>
            <ListItemText>Download as DOCX</ListItemText>
          </MenuItem>
          <MenuItem onClick={handlePrint}>
            <ListItemIcon>
              <Print fontSize="small" />
            </ListItemIcon>
            <ListItemText>Print Resume</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}

export default EditResume;