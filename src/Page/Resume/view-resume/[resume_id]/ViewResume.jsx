import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { getResumeData } from "../../../../Services/resumeAPI";
import ResumePreview from "../../edit-resume/components/PreviewPage";
import { useDispatch, useSelector } from "react-redux";
import { setResumeId, setResumeData } from "../../../../store";
import { toast } from "sonner";
import { Download, Share, PictureAsPdf, Description, Print, KeyboardArrowDown, Email, Link as LinkIcon } from "@mui/icons-material";
import Footer from "../../../../components/Footer";
import Navbar from "../../../../components/landing-page/Navbar";
import { exportToPDF, exportToDOCX, printResume, generatePDFAsBase64 } from "../../../../utils/resumeExport";
import EmailShareDialog from "../../../../components/EmailShareDialog";
import { sendResumeByEmail } from "../../../../Services/emailService";

function ViewResume() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const resumeInfo = useSelector((state) => state.editResume.resumeData);
  const resumeIdFromStore = useSelector((state) => state.editResume.resumeId);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const open = Boolean(anchorEl);
  const shareOpen = Boolean(shareAnchorEl);

  useEffect(() => {
    if (
      !resumeInfo ||
      !resumeIdFromStore ||
      String(resumeIdFromStore) !== String(resume_id)
    ) {
      fetchResumeInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume_id, resumeInfo, resumeIdFromStore]);

  const fetchResumeInfo = async () => {
    try {
      const response = await getResumeData(resume_id);
      dispatch(setResumeId(resume_id));
      dispatch(setResumeData(response.data ? response.data : response));
    } catch (error) {
      toast.error("Failed to load resume data");
      console.error("Error fetching resume:", error);
    }
  };

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
      const result = await exportToPDF('resume-preview', filename);
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

  const handleShareClick = (event) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleCloseShareMenu = () => {
    setShareAnchorEl(null);
  };

  const handleShareEmail = () => {
    handleCloseShareMenu();
    setEmailDialogOpen(true);
  };

  const handleShareLink = async () => {
    handleCloseShareMenu();
    const shareUrl = `${window.location.origin}/view-resumes/${resume_id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Resume",
          text: "Check out my AI-generated resume!",
          url: shareUrl,
        });
        toast.success("Link shared successfully!");
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Copy to clipboard as fallback
          copyToClipboard(shareUrl);
        }
      }
    } else {
      // Copy to clipboard as fallback
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleSendEmail = async (recipientEmail, message) => {
    try {
      // Generate PDF as base64
      toast.info('Generating PDF...');
      const pdfResult = await generatePDFAsBase64('resume-preview');
      
      if (!pdfResult.success) {
        toast.error('Failed to generate PDF');
        return;
      }

      // Prepare data
      const senderName = `${resumeInfo?.personal?.firstName || ''} ${resumeInfo?.personal?.lastName || ''}`.trim() || 'User';
      const filename = `${resumeInfo?.personal?.firstName || 'resume'}_${resumeInfo?.personal?.lastName || ''}_resume.pdf`.trim();

      // Send email
      toast.info('Sending email...');
      const result = await sendResumeByEmail(
        recipientEmail,
        senderName,
        message,
        pdfResult.data,
        filename
      );

      if (result.success) {
        toast.success('Resume sent successfully! 🎉');
        setEmailDialogOpen(false);
      } else {
        toast.error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('An error occurred while sending the email');
    }
  };

  // Theme green colors
  const greenMain = "#00897b";
  const greenDark = "#00695c";

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box id="noPrint">
          <Container sx={{ my: 5, mx: { xs: 2, md: 5, lg: 0 } }}>
            <Typography variant="h4" align="center" sx={{ fontWeight: 500 }}>
              Congrats! Your Ultimate AI generated Resume is ready!
            </Typography>

            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Now you are ready to download your resume and you can share unique
              resume URL with your friends and family.
            </Typography>

            <Stack
              direction="row"
              spacing={4}
              justifyContent="space-between"
              sx={{ px: { xs: 2, sm: 10, md: 16 }, my: 5 }}
            >
              <Box>
                <Button
                  variant="contained"
                  onClick={handleDownloadClick}
                  endIcon={downloading ? <CircularProgress size={16} color="inherit" /> : <KeyboardArrowDown />}
                  disabled={downloading}
                  sx={{
                    backgroundColor: greenMain,
                    color: "#fff",
                    '&:hover': {
                      backgroundColor: greenDark,
                    },
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                  }}
                >
                  <Download sx={{ mr: 1 }} />
                  {downloading ? 'Downloading...' : 'Download'}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  sx={{ mt: 1 }}
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

              <Box>
                <Button
                  variant="contained"
                  onClick={handleShareClick}
                  endIcon={<KeyboardArrowDown />}
                  sx={{
                    backgroundColor: greenMain,
                    color: "#fff",
                    '&:hover': {
                      backgroundColor: greenDark,
                    },
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                  }}
                >
                  <Share sx={{ mr: 1 }} />
                  Share
                </Button>
                <Menu
                  anchorEl={shareAnchorEl}
                  open={shareOpen}
                  onClose={handleCloseShareMenu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  sx={{ mt: 1 }}
                >
                  <MenuItem onClick={handleShareEmail}>
                    <ListItemIcon>
                      <Email fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Send via Email</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleShareLink}>
                    <ListItemIcon>
                      <LinkIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy Link</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            </Stack>
            
            {/* Email Share Dialog */}
            <EmailShareDialog
              open={emailDialogOpen}
              onClose={() => setEmailDialogOpen(false)}
              onSend={handleSendEmail}
              senderName={`${resumeInfo?.personal?.firstName || ''} ${resumeInfo?.personal?.lastName || ''}`.trim()}
            />
          </Container>
        </Box>

        <Paper
          elevation={3}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 4,
            width: "210mm",
            minHeight: "297mm",
            display: "flex",
            flexDirection: "column",
            // Remove fixed height and overflow for responsive height
          }}
          className="print-area"
        >
          <Box
            id="resume-preview"
            className="print"
            sx={{
              flex: 1,
              width: "100%",
              // Remove height and overflow so it grows with content
            }}
          >
            <ResumePreview />
          </Box>
        </Paper>

        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden !important;
            }
            .print-area, .print-area * {
              visibility: visible !important;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100vw !important;
              height: 100vh !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
              background: white !important;
              z-index: 9999 !important;
            }
            #noPrint, nav, footer {
              display: none !important;
            }
          }
        `}</style>
      </Box>
      <Footer />
    </>
  );
}

export default ViewResume;