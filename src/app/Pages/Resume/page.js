"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllResumeData } from "../../services/ResumeAPI";
import AddResume from "../../components/AddResume";
import ResumeCard from "../../components/ResumeCard";
import { Box, Typography, Grid, Container } from '@mui/material';

function Resume() {
  // Add error handling for the Redux state
  const userData = useSelector((state) => state?.editUser?.userData);
  const [resumeList, setResumeList] = useState([]);

  const fetchAllResumeData = async () => {
    try {
      const resumes = await getAllResumeData();
      console.log(
        "Printing from DashBoard List of Resumes got from Backend",
        resumes.data
      );
      setResumeList(resumes.data || []);
    } catch (error) {
      console.log("Error from dashboard", error.message);
      setResumeList([]);
    }
  };

  useEffect(() => {
    fetchAllResumeData();
    // Only add userData as dependency if it exists
    // This prevents errors when the state isn't loaded yet
  }, [userData?._id]);

  return (
    <Container sx={{ py: 5, px: { xs: 2, md: 5, lg: 8 } }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Resume
      </Typography>
      <Typography variant="body1" sx={{ py: 1.5 }}>
        Start creating your Ai resume for next Job role
      </Typography>
      <Grid container spacing={2} sx={{ mt: 2.5 }}>
        <Grid item xs={12} md={6} lg={4}>
          <AddResume />
        </Grid>
        {resumeList.length > 0 &&
          resumeList.map((resume) => (
            <Grid item xs={12} md={6} lg={4} key={resume._id}>
              <ResumeCard
                resume={resume}
                refreshData={fetchAllResumeData}
              />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}

export default Resume;