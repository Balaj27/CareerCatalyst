import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"
import { TrendingUp, TrendingDown, Visibility, People, Work, Schedule } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { db, auth } from "../../lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

const MetricCard = ({ title, value, change, changeType, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            {changeType === "increase" ? (
              <TrendingUp sx={{ color: "success.main", mr: 0.5, fontSize: 16 }} />
            ) : (
              <TrendingDown sx={{ color: "error.main", mr: 0.5, fontSize: 16 }} />
            )}
            <Typography variant="body2" color={changeType === "increase" ? "success.main" : "error.main"}>
              {change}% vs last month
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}.100`,
            color: `${color}.600`,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
)

const JobPerformanceTable = ({ jobs, applications }) => {
  // Map jobId to applications count and views
  const jobStats = jobs.map(job => {
    const jobApps = applications.filter(app => app.jobId === job.id);
    const views = job.views || 0;
    const conversion = views > 0 ? ((jobApps.length / views) * 100).toFixed(1) : 0;
    return {
      job: job.title,
      applications: jobApps.length,
      views,
      conversion,
    };
  });
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Job Performance
        </Typography>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job Title</TableCell>
                <TableCell align="right">Applications</TableCell>
                <TableCell align="right">Views</TableCell>
                <TableCell align="right">Conversion Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobStats.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.job}
                  </TableCell>
                  <TableCell align="right">{row.applications}</TableCell>
                  <TableCell align="right">{row.views}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                      <Box sx={{ width: 60, mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={parseFloat(row.conversion)}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                      {row.conversion}%
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

const TopSkillsChart = ({ topSkills }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Most In-Demand Skills
        </Typography>
        <Box>
          {topSkills.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2">{item.skill}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.count}
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={Math.min((item.count / topSkills[0].count) * 100, 100)} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const AnalyticsDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          setJobs([]);
          setApplications([]);
          setTopSkills([]);
          setLoading(false);
          return;
        }
        // Fetch jobs for this employer
        const jobsQ = query(collection(db, "jobs"), where("employerId", "==", user.uid));
        const jobsSnap = await getDocs(jobsQ);
        const jobsData = jobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJobs(jobsData);

        // Fetch applications for these jobs
        let jobIds = jobsData.map(j => j.id);
        let appsData = [];
        // Firestore 'in' queries are limited to 10 elements
        for (let i = 0; i < jobIds.length; i += 10) {
          const appsQ = query(collection(db, "applications"), where("jobId", "in", jobIds.slice(i, i + 10)));
          const appsSnap = await getDocs(appsQ);
          appsData = appsData.concat(appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
        setApplications(appsData);

        // Compute top skills
        const skillCounts = {};
        jobsData.forEach(job => {
          let skills = job.skills;
          if (typeof skills === "string") {
            skills = skills.split(",").map(s => s.trim()).filter(Boolean);
          }
          if (Array.isArray(skills)) {
            skills.forEach(skill => {
              const skillName = typeof skill === "object" && skill !== null ? skill.name : skill;
              if (skillName) {
                skillCounts[skillName] = (skillCounts[skillName] || 0) + 1;
              }
            });
          }
        });
        const sortedSkills = Object.entries(skillCounts)
          .map(([skill, count]) => ({ skill, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 7);
        setTopSkills(sortedSkills);
      } catch (err) {
        setJobs([]);
        setApplications([]);
        setTopSkills([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Compute metrics
  const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);
  const totalApplications = applications.length;
  const activeJobs = jobs.filter(j => (j.status || "Active") === "Active").length;
  // Interviews: not implemented, so show 0
  const interviews = 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#1a5f5f">
        Analytics Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Track your hiring performance and job posting analytics.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Views"
            value={loading ? "..." : totalViews}
            change={"-"}
            changeType="increase"
            icon={<Visibility />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Applications"
            value={loading ? "..." : totalApplications}
            change={"-"}
            changeType="increase"
            icon={<People />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Active Jobs" value={loading ? "..." : activeJobs} change={"-"} changeType="decrease" icon={<Work />} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Interviews"
            value={loading ? "..." : interviews}
            change={"-"}
            changeType="increase"
            icon={<Schedule />}
            color="warning"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <JobPerformanceTable jobs={jobs} applications={applications} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopSkillsChart topSkills={topSkills} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard
