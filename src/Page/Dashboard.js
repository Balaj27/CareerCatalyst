import React from "react";
import { Box, CssBaseline, Toolbar, Typography, Card, CardContent, Grid } from "@mui/material";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Sidebar from "../components/SideBar";
import Navbar from "../components/landing-page/Navbar";
import Footer from "../components/Footer";

const drawerWidth = 240;

export default function DashboardPage() {
  // Sample dummy data
  const coursesData = [
    { date: "Apr 1", completed: 5 },
    { date: "Apr 5", completed: 8 },
    { date: "Apr 10", completed: 12 },
    { date: "Apr 15", completed: 15 },
    { date: "Apr 20", completed: 18 },
    { date: "Apr 25", completed: 20 },
    { date: "Apr 30", completed: 22 },
  ];

  const jobsData = [
    { month: "Jan", applied: 8 },
    { month: "Feb", applied: 10 },
    { month: "Mar", applied: 12 },
    { month: "Apr", applied: 15 },
    { month: "May", applied: 13 },
    { month: "Jun", applied: 11 },
  ];

  const interviewsData = [
    { date: "Apr 1", interviews: 1 },
    { date: "Apr 5", interviews: 2 },
    { date: "Apr 10", interviews: 2 },
    { date: "Apr 15", interviews: 3 },
    { date: "Apr 20", interviews: 4 },
    { date: "Apr 25", interviews: 5 },
    { date: "Apr 30", interviews: 6 },
  ];

  const mockTestScores = [
    { test: "Test 1", score: 70 },
    { test: "Test 2", score: 75 },
    { test: "Test 3", score: 78 },
    { test: "Test 4", score: 80 },
    { test: "Test 5", score: 82 },
  ];

  return (
    <><Navbar />

      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f5f5f5", p: 3, ml: `0px` }}>
        <Toolbar />
        <Box sx={{ p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
          <Typography variant="h4" gutterBottom>
            Overview
          </Typography>

          {/* Stats Cards */}
          <Grid container spacing={2} mb={3}>
            {[
              { label: "Courses Completed", value: "22", change: "+10%" },
              { label: "Jobs Applied", value: "45", change: "+5%" },
              { label: "Interviews Done", value: "6", change: "+8%" },
              { label: "Mock Test Avg", value: "80%", change: "+2%" },
            ].map((stat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ bgcolor: "#fff", color: "#000", boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="h5">{stat.value}</Typography>
                    <Typography variant="body2" color="green">
                      {stat.change}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Grid container spacing={2}>
            {/* Courses Completed Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: "#fff", boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Courses Completed (Last 30 days)
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={coursesData}>
                      <CartesianGrid stroke="#e0e0e0" />
                      <XAxis dataKey="date" stroke="#333" />
                      <YAxis stroke="#333" />
                      <Tooltip />
                      <Line type="monotone" dataKey="completed" stroke="#1976d2" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Jobs Applied Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: "#fff", boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Jobs Applied (Last 6 months)
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={jobsData}>
                      <CartesianGrid stroke="#e0e0e0" />
                      <XAxis dataKey="month" stroke="#333" />
                      <YAxis stroke="#333" />
                      <Tooltip />
                      <Bar dataKey="applied" fill="#4caf50" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Interviews Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: "#fff", boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Interviews Completed
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={interviewsData}>
                      <CartesianGrid stroke="#e0e0e0" />
                      <XAxis dataKey="date" stroke="#333" />
                      <YAxis stroke="#333" />
                      <Tooltip />
                      <Line type="monotone" dataKey="interviews" stroke="#ff5722" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Mock Test Scores Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: "#fff", boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Mock Test Score Average
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={mockTestScores}>
                      <CartesianGrid stroke="#e0e0e0" />
                      <XAxis dataKey="test" stroke="#333" />
                      <YAxis stroke="#333" />
                      <Tooltip />
                      <Bar dataKey="score" fill="#9c27b0" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer/>
    </>
  );
}
