import { Grid, Card, CardContent, Typography, Box, LinearProgress, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from "@mui/material"
import { Work, People, Visibility, TrendingUp, Pause, Delete as DeleteIcon, PlayArrow, Edit as EditIcon } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { db, auth } from "../../lib/firebase"
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore"

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
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [confirmDelete, setConfirmDelete] = useState({ open: false, jobId: null })
  const [editDialog, setEditDialog] = useState({ open: false, job: null, saving: false, error: "" })
  // Handle edit button click
  const handleEdit = (job) => {
    setEditDialog({ open: true, job: { ...job }, saving: false, error: "" })
  }

  // Handle edit dialog field change
  const handleEditFieldChange = (field, value) => {
    setEditDialog((prev) => ({ ...prev, job: { ...prev.job, [field]: value } }))
  }

  // Save edited job
  const handleEditSave = async () => {
    setEditDialog((prev) => ({ ...prev, saving: true, error: "" }))
    try {
      const { id, ...jobData } = editDialog.job
      await updateDoc(doc(db, "jobs", id), jobData)
      setEditDialog({ open: false, job: null, saving: false, error: "" })
      fetchJobs()
    } catch (err) {
      setEditDialog((prev) => ({ ...prev, saving: false, error: "Failed to save changes." }))
    }
  }

  const fetchJobs = async () => {
    setLoading(true)
    setError("")
    try {
      const user = auth.currentUser
      if (!user) {
        setJobs([])
        setLoading(false)
        return
      }
      const q = query(collection(db, "jobs"), where("employerId", "==", user.uid))
      const snapshot = await getDocs(q)
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (err) {
      setError("Failed to load jobs.")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchJobs()
    // Optionally, add a listener for auth state changes to refetch jobs
    // eslint-disable-next-line
  }, [])

  const handlePause = async (job) => {
    try {
      await updateDoc(doc(db, "jobs", job.id), { status: job.status === "Active" ? "Paused" : "Active" })
      fetchJobs()
    } catch (err) {
      alert("Failed to update job status.")
    }
  }

  const handleDelete = async (jobId) => {
    try {
      await deleteDoc(doc(db, "jobs", jobId))
      setConfirmDelete({ open: false, jobId: null })
      fetchJobs()
    } catch (err) {
      alert("Failed to delete job.")
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Active Job Postings
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : jobs.length === 0 ? (
          <Typography>No jobs found.</Typography>
        ) : (
          <Box>
            {jobs.map((job, index) => (
              <Box
                key={job.id}
                sx={{
                  py: 2,
                  borderBottom: index < jobs.length - 1 ? "1px solid #e0e0e0" : "none",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {job.title}
                  </Typography>
                  <Chip label={job.status || "Active"} size="small" color={(job.status || "Active") === "Active" ? "success" : "warning"} />
                </Box>
                <Box sx={{ display: "flex", gap: 3, mb: 1, alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {job.applicants !== undefined ? job.applicants : 0} applications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.views !== undefined ? job.views : 0} views
                  </Typography>
                  <IconButton onClick={() => handlePause(job)} title={job.status === "Active" ? "Pause" : "Resume"}>
                    {job.status === "Active" ? <Pause /> : <PlayArrow />}
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleEdit(job)} title="Edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => setConfirmDelete({ open: true, jobId: job.id })} title="Delete">
                    <DeleteIcon />
                  </IconButton>
                        {/* Edit Job Dialog */}
                        <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, job: null, saving: false, error: "" })} maxWidth="sm" fullWidth>
                          <DialogTitle>Edit Job</DialogTitle>
                          <DialogContent dividers>
                            {editDialog.job && (
                              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField label="Title" value={editDialog.job.title || ''} onChange={e => handleEditFieldChange('title', e.target.value)} fullWidth />
                                <TextField label="Company" value={editDialog.job.company || ''} onChange={e => handleEditFieldChange('company', e.target.value)} fullWidth />
                                <TextField label="Location" value={editDialog.job.location || ''} onChange={e => handleEditFieldChange('location', e.target.value)} fullWidth />
                                <TextField label="Job Type" value={editDialog.job.jobType || ''} onChange={e => handleEditFieldChange('jobType', e.target.value)} select fullWidth>
                                  <MenuItem value="Full Time">Full Time</MenuItem>
                                  <MenuItem value="Part Time">Part Time</MenuItem>
                                  <MenuItem value="Internship">Internship</MenuItem>
                                  <MenuItem value="Contract">Contract</MenuItem>
                                </TextField>
                                <TextField label="Experience" value={editDialog.job.experience || ''} onChange={e => handleEditFieldChange('experience', e.target.value)} fullWidth />
                                <TextField label="Salary" value={editDialog.job.salary || ''} onChange={e => handleEditFieldChange('salary', e.target.value)} fullWidth />
                                <TextField label="Description" value={editDialog.job.description || ''} onChange={e => handleEditFieldChange('description', e.target.value)} multiline minRows={2} fullWidth />
                                <TextField label="Requirements" value={editDialog.job.requirements || ''} onChange={e => handleEditFieldChange('requirements', e.target.value)} multiline minRows={2} fullWidth />
                                <TextField label="Skills (comma separated)" value={Array.isArray(editDialog.job.skills) ? editDialog.job.skills.join(', ') : ''} onChange={e => handleEditFieldChange('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} fullWidth />
                                {editDialog.error && <Typography color="error">{editDialog.error}</Typography>}
                              </Box>
                            )}
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => setEditDialog({ open: false, job: null, saving: false, error: "" })} disabled={editDialog.saving}>Cancel</Button>
                            <Button onClick={handleEditSave} color="primary" disabled={editDialog.saving}>{editDialog.saving ? "Saving..." : "Save"}</Button>
                          </DialogActions>
                        </Dialog>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={job.applicants ? Math.min((job.applicants / 100) * 100, 100) : 0}
                  sx={{ height: 4, borderRadius: 2 }}
                />
              </Box>
            ))}
          </Box>
        )}
        {/* Confirm Delete Dialog */}
        <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, jobId: null })}>
          <DialogTitle>Delete Job</DialogTitle>
          <DialogContent>Are you sure you want to delete this job?</DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete({ open: false, jobId: null })}>Cancel</Button>
            <Button color="error" onClick={() => handleDelete(confirmDelete.jobId)}>Delete</Button>
          </DialogActions>
        </Dialog>
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
