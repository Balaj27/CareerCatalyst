import { Grid, Card, CardContent, Typography, Box, LinearProgress, Chip } from "@mui/material"
import { Work, People, Visibility, TrendingUp } from "@mui/icons-material"

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: "100%", position: "relative", overflow: "visible" }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: `${color}.100`,
            color: `${color}.600`,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
        </Box>
      </Box>
      {trend && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TrendingUp sx={{ color: "success.main", mr: 0.5, fontSize: 16 }} />
          <Typography variant="body2" color="success.main">
            +{trend}% from last month
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
)

const RecentActivity = () => {
  const activities = [
    { action: "New application received", job: "Senior React Developer", time: "2 hours ago" },
    { action: "Job posted successfully", job: "UI/UX Designer", time: "1 day ago" },
    { action: "Interview scheduled", job: "Backend Developer", time: "2 days ago" },
    { action: "Candidate shortlisted", job: "Product Manager", time: "3 days ago" },
  ]

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Box>
          {activities.map((activity, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.5,
                borderBottom: index < activities.length - 1 ? "1px solid #e0e0e0" : "none",
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {activity.action}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activity.job}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {activity.time}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

const ActiveJobs = () => {
  const jobs = [
    { title: "Senior React Developer", applications: 45, views: 234, status: "Active" },
    { title: "UI/UX Designer", applications: 32, views: 189, status: "Active" },
    { title: "Backend Developer", applications: 28, views: 156, status: "Paused" },
    { title: "Product Manager", applications: 67, views: 345, status: "Active" },
  ]

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Active Job Postings
        </Typography>
        <Box>
          {jobs.map((job, index) => (
            <Box
              key={index}
              sx={{
                py: 2,
                borderBottom: index < jobs.length - 1 ? "1px solid #e0e0e0" : "none",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="body1" fontWeight="medium">
                  {job.title}
                </Typography>
                <Chip label={job.status} size="small" color={job.status === "Active" ? "success" : "warning"} />
              </Box>
              <Box sx={{ display: "flex", gap: 3, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {job.applications} applications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.views} views
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(job.applications / 100) * 100}
                sx={{ height: 4, borderRadius: 2 }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

const DashboardOverview = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#1a5f5f">
        Welcome back, Employer!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here's what's happening with your job postings today.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Jobs" value="12" icon={<Work />} color="primary" trend="8" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Applications" value="248" icon={<People />} color="success" trend="15" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Profile Views" value="1,234" icon={<Visibility />} color="info" trend="12" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Interviews Scheduled" value="18" icon={<TrendingUp />} color="warning" trend="25" />
        </Grid>

        <Grid item xs={12} md={8}>
          <ActiveJobs />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentActivity />
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardOverview
