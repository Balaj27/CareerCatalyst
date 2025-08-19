import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Stack,
} from "@mui/material";
import { getResumeData } from "../../../../Services/resumeAPI";
import ResumePreview from "../../edit-resume/components/PreviewPage";
import { useDispatch, useSelector } from "react-redux";
import { setResumeId, setResumeData } from "../../../../store";
import { toast } from "sonner";
import { Download, Share } from "@mui/icons-material";
import Footer from "../../../../components/Footer";
import Navbar from "../../../../components/landing-page/Navbar";

function ViewResume() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const resumeInfo = useSelector((state) => state.editResume.resumeData);
  const resumeIdFromStore = useSelector((state) => state.editResume.resumeId);

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

  const handleDownload = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: "My Resume",
      text: "Check out my AI-generated resume!",
      url: `${import.meta.env.VITE_BASE_URL}/dashboard/view-resume/${resume_id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast("Resume Shared Successfully");
      } catch (err) {
        toast.error("Failed to share resume.");
      }
    } else {
      toast.warning("Web Share API is not supported in your browser.");
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
              <Button
                variant="contained"
                onClick={handleDownload}
                startIcon={<Download />}
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
                Download
              </Button>

              <Button
                variant="contained"
                onClick={handleShare}
                startIcon={<Share />}
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
                Share
              </Button>
            </Stack>
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