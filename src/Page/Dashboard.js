import React, { useState, useEffect } from "react";
import { Box, CssBaseline, Toolbar, Typography, Card, CardContent, Grid, CircularProgress, List, ListItem, ListItemText, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Avatar, Stack, LinearProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import Sidebar from "../components/SideBar";
import Navbar from "../components/landing-page/Navbar";
import Footer from "../components/Footer";
import { auth } from "../lib/firebase";
import { db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getApplicationsForUser, updateApplicationStatus } from "../lib/firestore-application";
import { getOffersForCandidate, updateOfferStatus } from "../lib/firestore-offers";
import { sendCandidateEmail } from "../Services/sendCandidateEmail";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WorkIcon from "@mui/icons-material/Work";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/material/styles";

const drawerWidth = 240;

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 8px 24px rgba(0, 77, 64, 0.15)",
    transform: "translateY(-4px)",
  },
}));

const StatsCard = styled(StyledCard)(({ theme, borderColor }) => ({
  background: "linear-gradient(135deg, #ffffff 0%, #f0f8f7 100%)",
  borderTop: `4px solid ${borderColor}`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    right: "-20px",
    top: "-20px",
    width: "120px",
    height: "120px",
    opacity: 0.05,
    borderRadius: "50%",
  },
}));

const ChartCard = styled(StyledCard)(({ theme }) => ({
  background: "#ffffff",
  borderRadius: "12px",
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #004D40 0%, #00695C 100%)",
  borderRadius: "12px",
  padding: "24px",
  color: "white",
  marginBottom: "32px",
  boxShadow: "0 4px 20px rgba(0, 77, 64, 0.3)",
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 700,
  background: "linear-gradient(135deg, #004D40 0%, #00695C 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginTop: "8px",
  marginBottom: "8px",
}));

// Helper function to get job details by ID
const getJobById = async (jobId) => {
  try {
    const jobDoc = await getDoc(doc(db, "jobs", jobId));
    if (jobDoc.exists()) {
      return { id: jobDoc.id, ...jobDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching job:", error);
    return null;
  }
};

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsData, setJobsData] = useState([]);
  const [statusBreakdown, setStatusBreakdown] = useState([]);
  const [applicationDetails, setApplicationDetails] = useState([]);
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [offerDetailOpen, setOfferDetailOpen] = useState(false);
  const [respondingToOffer, setRespondingToOffer] = useState(false);

  // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch applications data
  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userApps = await getApplicationsForUser(currentUser.uid);
        setApplications(userApps);

        // Process data for charts
        processApplicationData(userApps);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  // Fetch job offers
  useEffect(() => {
    const fetchOffers = async () => {
      if (!currentUser) return;
      
      try {
        setOffersLoading(true);
        const userOffers = await getOffersForCandidate(currentUser.uid);
        setOffers(userOffers);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setOffersLoading(false);
      }
    };

    fetchOffers();
  }, [currentUser]);

  const processApplicationData = async (apps) => {
    // Count applications by month
    const monthlyData = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    apps.forEach((app) => {
      const appliedDate = app.appliedAt?.toDate?.() || new Date(app.appliedAt);
      const monthKey = months[appliedDate.getMonth()];
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    // Create chart data
    const chartData = months.map((month) => ({
      month,
      applied: monthlyData[month] || 0,
    })).filter(d => d.applied > 0 || months.indexOf(d.month) <= new Date().getMonth());

    setJobsData(chartData);

    // Status breakdown
    const statusCount = {
      pending: 0,
      accepted: 0,
      rejected: 0,
    };

    apps.forEach((app) => {
      const status = app.status || "pending";
      if (statusCount[status] !== undefined) {
        statusCount[status]++;
      } else {
        statusCount.pending++;
      }
    });

    const breakdown = [
      { name: "Pending", value: statusCount.pending, color: "#ff9800" },
      { name: "Accepted", value: statusCount.accepted, color: "#4caf50" },
      { name: "Rejected", value: statusCount.rejected, color: "#f44336" },
    ];

    setStatusBreakdown(breakdown);

    // Fetch job details for applications
    const detailedApps = await Promise.all(
      apps.slice(0, 10).map(async (app) => {
        try {
          const job = await getJobById(app.jobId);
          return {
            ...app,
            jobTitle: job?.title || "Unknown Job",
            company: job?.company || "Unknown Company",
            status: app.status || "Pending",
          };
        } catch {
          return {
            ...app,
            jobTitle: "Unknown Job",
            company: "Unknown Company",
            status: app.status || "Pending",
          };
        }
      })
    );

    setApplicationDetails(detailedApps);
  };

  const handleRespondToOffer = async (offerId, status) => {
    setRespondingToOffer(true);
    try {
      const selectedOfferData = offers.find(o => o.id === offerId);
      
      await updateOfferStatus(offerId, status);
      
      // If offer is accepted, also update the corresponding application status
      if (status === 'accepted') {
        try {
          // Find the application for this job
          const relatedApp = applications.find(app => app.jobId === selectedOfferData?.jobId);
          if (relatedApp) {
            await updateApplicationStatus(relatedApp.id, 'accepted', offerId);
            // Refresh applications data
            const updatedApps = await getApplicationsForUser(currentUser.uid);
            setApplications(updatedApps);
            processApplicationData(updatedApps);
          }
        } catch (appError) {
          console.warn("Could not update application status:", appError);
        }
      }
      
      // Update offers list
      const updatedOffers = offers.map(o => 
        o.id === offerId ? { ...o, status } : o
      );
      setOffers(updatedOffers);

      // Send email to candidate confirming their response
      await sendCandidateEmail({
        to: currentUser?.email,
        subject: `Offer ${status === 'accepted' ? 'Accepted' : 'Rejected'}: ${selectedOfferData?.jobTitle}`,
        body: `<b>Offer Response Confirmation</b><br><br>
        You have <b>${status === 'accepted' ? 'accepted' : 'rejected'}</b> the job offer for the position of <b>${selectedOfferData?.jobTitle}</b> at <b>${selectedOfferData?.company}</b>.<br><br>
        <b>Offer Details:</b><br>
        Company: ${selectedOfferData?.company}<br>
        Position: ${selectedOfferData?.jobTitle}<br>
        Salary: ${selectedOfferData?.currency} ${selectedOfferData?.salary?.min?.toLocaleString()} - ${selectedOfferData?.salary?.max?.toLocaleString()}<br>
        Job Type: ${selectedOfferData?.jobType}<br>
        Start Date: ${selectedOfferData?.startDate}<br><br>
        ${status === 'accepted' 
          ? 'Congratulations on accepting the offer! The employer will be in touch with next steps.' 
          : 'Thank you for considering this opportunity. We wish you all the best in your career journey.'}<br><br>
        Best regards,<br>
        CareerCatalyst Team`,
        company: selectedOfferData?.company,
        jobTitle: selectedOfferData?.jobTitle,
        candidateName: currentUser?.displayName || currentUser?.email,
      });

      // Send email to employer about candidate's response
      await sendCandidateEmail({
        to: selectedOfferData?.employerEmail || "employer@company.com",
        subject: `Candidate ${status === 'accepted' ? 'Accepted' : 'Rejected'} Your Job Offer`,
        body: `<b>Offer Response from Candidate</b><br><br>
        The candidate has <b>${status === 'accepted' ? 'accepted' : 'rejected'}</b> your job offer.<br><br>
        <b>Candidate Details:</b><br>
        Name: ${selectedOfferData?.candidateEmail?.split('@')[0] || 'Candidate'}<br>
        Email: ${selectedOfferData?.candidateEmail}<br><br>
        <b>Offer Details:</b><br>
        Position: ${selectedOfferData?.jobTitle}<br>
        Salary: ${selectedOfferData?.currency} ${selectedOfferData?.salary?.min?.toLocaleString()} - ${selectedOfferData?.salary?.max?.toLocaleString()}<br>
        Job Type: ${selectedOfferData?.jobType}<br>
        Start Date: ${selectedOfferData?.startDate}<br><br>
        ${status === 'accepted' 
          ? 'The candidate has accepted your offer. Please reach out to them to discuss next steps.' 
          : 'Unfortunately, the candidate has rejected your offer. You may continue reviewing other candidates.'}<br><br>
        Best regards,<br>
        CareerCatalyst Team`,
        company: selectedOfferData?.company,
        jobTitle: selectedOfferData?.jobTitle,
        candidateName: selectedOfferData?.candidateEmail,
      });

      setOfferDetailOpen(false);
      setSelectedOffer(null);
      alert(`Offer ${status}! ${status === 'accepted' ? 'Your application and dashboard have been updated.' : ''} Both you and the employer have been notified.`);
    } catch (error) {
      alert("Failed to respond to offer: " + error.message);
    } finally {
      setRespondingToOffer(false);
    }
  };

  return (
    <>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f5f5f5", p: 0, ml: `0px`, minHeight: "100vh" }}>
        <Toolbar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header Section */}
          <HeaderBox>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  📊 Your Career Dashboard
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Track your job applications and career progress at a glance
                </Typography>
              </Box>
            </Stack>
          </HeaderBox>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
              <CircularProgress sx={{ color: "#004D40" }} size={60} />
            </Box>
          ) : (
            <>
              {/* Stats Cards Row 1 */}
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard borderColor="#004D40">
                    <CardContent sx={{ position: "relative", zIndex: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box sx={{ 
                          bgcolor: "rgba(0, 77, 64, 0.1)", 
                          borderRadius: "12px", 
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <WorkIcon sx={{ color: "#004D40", fontSize: 28 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ color: "#666", fontSize: "0.9rem" }}>
                            Total Applied
                          </Typography>
                          <StatNumber>
                            {applications.length}
                          </StatNumber>
                        </Box>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(100, (applications.length / 50) * 100)}
                        sx={{ mt: 2, borderRadius: 1, bgcolor: "rgba(0, 77, 64, 0.1)", "& .MuiLinearProgress-bar": { bgcolor: "#004D40" } }}
                      />
                    </CardContent>
                  </StatsCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard borderColor="#00A389">
                    <CardContent sx={{ position: "relative", zIndex: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box sx={{ 
                          bgcolor: "rgba(0, 163, 137, 0.1)", 
                          borderRadius: "12px", 
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <CheckCircleIcon sx={{ color: "#00A389", fontSize: 28 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ color: "#666", fontSize: "0.9rem" }}>
                            Offers Received
                          </Typography>
                          <StatNumber sx={{ background: "linear-gradient(135deg, #00A389 0%, #008073 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {statusBreakdown.find(s => s.name === "Accepted")?.value || 0}
                          </StatNumber>
                        </Box>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(100, ((statusBreakdown.find(s => s.name === "Accepted")?.value || 0) / (applications.length || 1)) * 100)}
                        sx={{ mt: 2, borderRadius: 1, bgcolor: "rgba(0, 163, 137, 0.1)", "& .MuiLinearProgress-bar": { bgcolor: "#00A389" } }}
                      />
                    </CardContent>
                  </StatsCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard borderColor="#FF9800">
                    <CardContent sx={{ position: "relative", zIndex: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box sx={{ 
                          bgcolor: "rgba(255, 152, 0, 0.1)", 
                          borderRadius: "12px", 
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <HourglassEmptyIcon sx={{ color: "#FF9800", fontSize: 28 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ color: "#666", fontSize: "0.9rem" }}>
                            Pending
                          </Typography>
                          <StatNumber sx={{ background: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {statusBreakdown.find(s => s.name === "Pending")?.value || 0}
                          </StatNumber>
                        </Box>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(100, ((statusBreakdown.find(s => s.name === "Pending")?.value || 0) / (applications.length || 1)) * 100)}
                        sx={{ mt: 2, borderRadius: 1, bgcolor: "rgba(255, 152, 0, 0.1)", "& .MuiLinearProgress-bar": { bgcolor: "#FF9800" } }}
                      />
                    </CardContent>
                  </StatsCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard borderColor="#D32F2F">
                    <CardContent sx={{ position: "relative", zIndex: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box sx={{ 
                          bgcolor: "rgba(211, 47, 47, 0.1)", 
                          borderRadius: "12px", 
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <CancelIcon sx={{ color: "#D32F2F", fontSize: 28 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ color: "#666", fontSize: "0.9rem" }}>
                            Rejected
                          </Typography>
                          <StatNumber sx={{ background: "linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {statusBreakdown.find(s => s.name === "Rejected")?.value || 0}
                          </StatNumber>
                        </Box>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(100, ((statusBreakdown.find(s => s.name === "Rejected")?.value || 0) / (applications.length || 1)) * 100)}
                        sx={{ mt: 2, borderRadius: 1, bgcolor: "rgba(211, 47, 47, 0.1)", "& .MuiLinearProgress-bar": { bgcolor: "#D32F2F" } }}
                      />
                    </CardContent>
                  </StatsCard>
                </Grid>
              </Grid>

              {/* Job Offers Section */}
              <Grid item xs={12}>
                <ChartCard>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                      <CheckCircleIcon sx={{ color: "#004D40" }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                        Job Offers
                      </Typography>
                      <Chip 
                        label={offers.filter(o => o.status === 'pending').length} 
                        size="small" 
                        sx={{ bgcolor: "#FF9800", color: "white" }}
                      />
                    </Stack>
                    {offersLoading ? (
                      <Box sx={{ p: 4, textAlign: "center" }}>
                        <CircularProgress size={30} sx={{ color: "#004D40" }} />
                      </Box>
                    ) : offers.length > 0 ? (
                      <Grid container spacing={2}>
                        {offers.map((offer) => (
                          <Grid item xs={12} sm={6} md={4} key={offer.id}>
                            <Card sx={{ 
                              borderLeft: `4px solid ${offer.status === 'pending' ? '#FF9800' : offer.status === 'accepted' ? '#4CAF50' : '#F44336'}`,
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              "&:hover": { 
                                boxShadow: 4,
                                transform: "translateY(-4px)"
                              }
                            }} onClick={() => {
                              setSelectedOffer(offer);
                              setOfferDetailOpen(true);
                            }}>
                              <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
                                  {offer.jobTitle}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                  {offer.company}
                                </Typography>
                                <Stack spacing={1} sx={{ mb: 2 }}>
                                  <Typography variant="body2">
                                    <strong>Salary:</strong> {offer.currency} {offer.salary?.min?.toLocaleString()} - {offer.salary?.max?.toLocaleString()}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Type:</strong> {offer.jobType}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Start:</strong> {offer.startDate}
                                  </Typography>
                                </Stack>
                                <Chip
                                  label={offer.status?.charAt(0).toUpperCase() + offer.status?.slice(1)}
                                  size="small"
                                  color={
                                    offer.status === 'accepted'
                                      ? 'success'
                                      : offer.status === 'rejected'
                                      ? 'error'
                                      : 'warning'
                                  }
                                  variant="filled"
                                />
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Box sx={{ p: 4, textAlign: "center", bgcolor: "#F0F8F7", borderRadius: "8px" }}>
                        <Typography color="textSecondary" sx={{ fontSize: "1rem" }}>
                          No job offers yet. Keep applying! 🚀
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </ChartCard>
              </Grid>

              {/* Charts Row */}
              <Grid container spacing={3} mb={4}>
                {/* Applications Chart */}
                <Grid item xs={12} md={6}>
                  <ChartCard>
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <TrendingUpIcon sx={{ color: "#004D40" }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                          Applications Trend
                        </Typography>
                      </Stack>
                      {jobsData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                          <BarChart data={jobsData}>
                            <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
                            <XAxis dataKey="month" stroke="#999" />
                            <YAxis stroke="#999" />
                            <Tooltip 
                              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0, 77, 64, 0.15)" }}
                              cursor={{ fill: "rgba(0, 77, 64, 0.1)" }}
                            />
                            <Bar dataKey="applied" fill="#004D40" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box sx={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Typography color="textSecondary">No data available yet</Typography>
                        </Box>
                      )}
                    </CardContent>
                  </ChartCard>
                </Grid>

                {/* Status Breakdown Pie Chart */}
                <Grid item xs={12} md={6}>
                  <ChartCard>
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <WorkIcon sx={{ color: "#004D40" }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                          Status Distribution
                        </Typography>
                      </Stack>
                      {statusBreakdown.some(s => s.value > 0) ? (
                        <ResponsiveContainer width="100%" height={280}>
                          <PieChart>
                            <Pie
                              data={statusBreakdown}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value }) => `${name}: ${value}`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {statusBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0, 77, 64, 0.15)" }} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box sx={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Typography color="textSecondary">No data available yet</Typography>
                        </Box>
                      )}
                    </CardContent>
                  </ChartCard>
                </Grid>
              </Grid>

              {/* Recent Applications Table */}
              <Grid item xs={12}>
                <ChartCard>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                      <WorkIcon sx={{ color: "#004D40" }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                        Recent Applications
                      </Typography>
                    </Stack>
                    {applicationDetails.length > 0 ? (
                      <TableContainer sx={{ borderRadius: "8px", overflow: "hidden" }}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#E8F5F2" }}>
                              <TableCell sx={{ fontWeight: 600, color: "#004D40", borderBottom: "2px solid #00A389" }}>Job Title</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: "#004D40", borderBottom: "2px solid #00A389" }}>Company</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: "#004D40", borderBottom: "2px solid #00A389" }}>Applied Date</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: "#004D40", borderBottom: "2px solid #00A389" }}>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {applicationDetails.map((app, index) => (
                              <TableRow 
                                key={app.id} 
                                hover
                                sx={{ 
                                  "&:hover": { backgroundColor: "#F0F8F7" },
                                  borderBottom: "1px solid #f0f0f0"
                                }}
                              >
                                <TableCell sx={{ py: 2 }}>
                                  <Typography sx={{ fontWeight: 500, color: "#333" }}>{app.jobTitle}</Typography>
                                </TableCell>
                                <TableCell sx={{ py: 2 }}>
                                  <Typography sx={{ color: "#666" }}>{app.company}</Typography>
                                </TableCell>
                                <TableCell sx={{ py: 2 }}>
                                  <Typography sx={{ color: "#666", fontSize: "0.9rem" }}>
                                    {app.appliedAt?.toDate?.()?.toLocaleDateString?.() || 
                                     new Date(app.appliedAt).toLocaleDateString?.() || 
                                     "N/A"}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ py: 2 }}>
                                  <Chip
                                    label={app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                    color={
                                      app.status === "accepted"
                                        ? "success"
                                        : app.status === "rejected"
                                        ? "error"
                                        : "warning"
                                    }
                                    variant="filled"
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Box sx={{ p: 4, textAlign: "center", bgcolor: "#F0F8F7", borderRadius: "8px" }}>
                        <Typography color="textSecondary" sx={{ fontSize: "1rem" }}>
                          No applications found. Start applying to jobs to see them here! 🚀
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </ChartCard>
              </Grid>
            </>
          )}
        </Container>
      </Box>

      {/* Offer Detail Dialog */}
      <Dialog open={offerDetailOpen} onClose={() => setOfferDetailOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#004D40", color: "white", fontWeight: 600 }}>
          Job Offer Details
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedOffer && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {selectedOffer.jobTitle}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {selectedOffer.company}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Salary</Typography>
                <Typography variant="body2">
                  {selectedOffer.currency} {selectedOffer.salary?.min?.toLocaleString()} - {selectedOffer.salary?.max?.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Job Type</Typography>
                <Typography variant="body2">{selectedOffer.jobType}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Start Date</Typography>
                <Typography variant="body2">{selectedOffer.startDate}</Typography>
              </Grid>
              {selectedOffer.description && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Description</Typography>
                  <Typography variant="body2" color="textSecondary">{selectedOffer.description}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Status</Typography>
                <Chip
                  label={selectedOffer.status?.charAt(0).toUpperCase() + selectedOffer.status?.slice(1)}
                  color={
                    selectedOffer.status === 'accepted'
                      ? 'success'
                      : selectedOffer.status === 'rejected'
                      ? 'error'
                      : 'warning'
                  }
                  variant="filled"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOfferDetailOpen(false)}>Close</Button>
          {selectedOffer?.status === 'pending' && (
            <>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleRespondToOffer(selectedOffer.id, 'rejected')}
                disabled={respondingToOffer}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#004D40", "&:hover": { bgcolor: "#003d33" } }}
                onClick={() => handleRespondToOffer(selectedOffer.id, 'accepted')}
                disabled={respondingToOffer}
              >
                Accept
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
}
