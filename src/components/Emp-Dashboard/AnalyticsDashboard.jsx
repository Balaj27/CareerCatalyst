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

const JobPerformanceTable = () => {
  const jobData = [
    { job: "Senior React Developer", applications: 45, views: 234, conversion: 19.2 },
    { job: "UI/UX Designer", applications: 32, views: 189, conversion: 16.9 },
    { job: "Backend Developer", applications: 28, views: 156, conversion: 17.9 },
    { job: "Product Manager", applications: 67, views: 345, conversion: 19.4 },
    { job: "DevOps Engineer", applications: 23, views: 134, conversion: 17.2 },
  ]

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
              {jobData.map((row, index) => (
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
                          value={row.conversion}
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
  )
}

const TopSkillsChart = () => {
  const skills = [
    { skill: "React", demand: 85 },
    { skill: "JavaScript", demand: 78 },
    { skill: "Python", demand: 72 },
    { skill: "Node.js", demand: 65 },
    { skill: "TypeScript", demand: 58 },
    { skill: "AWS", demand: 52 },
  ]

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Most In-Demand Skills
        </Typography>
        <Box>
          {skills.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2">{item.skill}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.demand}%
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={item.demand} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

const AnalyticsDashboard = () => {
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
            value="2,847"
            change="12"
            changeType="increase"
            icon={<Visibility />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Applications"
            value="195"
            change="8"
            changeType="increase"
            icon={<People />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Active Jobs" value="12" change="3" changeType="decrease" icon={<Work />} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Interviews"
            value="28"
            change="15"
            changeType="increase"
            icon={<Schedule />}
            color="warning"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <JobPerformanceTable />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopSkillsChart />
        </Grid>
      </Grid>
    </Box>
  )
}

export default AnalyticsDashboard
