"use client"

import { useState, useMemo } from "react"
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Slide,
  Popover,
} from "@mui/material"
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  Launch as LaunchIcon,
  Preview as PreviewIcon,
  FilterAlt as FilterAltIcon,
} from "@mui/icons-material"
import { CssBaseline } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import Navbar from "../components/landing-page/Navbar"
import Footer from "../components/Footer"

interface Job {
  id: string
  site: string
  job_url: string
  job_url_direct?: string
  title: string
  company: string
  location: string
  date_posted: string
  job_type?: string
  salary_source?: string
  interval?: string
  min_amount?: number
  max_amount?: number
  currency?: string
  is_remote?: boolean
  job_level?: string
  job_function?: string
  listing_type?: string
  emails?: string
  description?: string
  company_industry?: string
  company_url?: string
  company_logo?: string
  company_url_direct?: string
  company_addresses?: string
  company_num_employees?: number
  company_revenue?: string
  company_description?: string
  skills?: string
  experience_range?: string
  company_rating?: number
  company_reviews_count?: number
  vacancy_count?: number
  work_from_home_type?: string
  salary?: string
}

interface ScrapeParams {
  site_name: string[]
  search_term: string
  google_search_term: string
  location: string
  results_wanted: number
  hours_old: number
  country_indeed: string
}

const availableSites = [
  { id: "indeed", label: "Indeed" },
  { id: "linkedin", label: "LinkedIn" },
]

// Colors inspired by /images/job-scraper-theme.png
const brand = {
  primary: "#0F564F", // deep teal (hero)
  primaryDark: "#0A3E39", // darker teal
  accent: "#20B0A6", // aqua/teal accent (buttons, chips)
  offWhite: "#F3F7F6", // soft background
  ink: "#0E1F1A", // dark text
  inkMuted: "#3E5F58", // secondary text
}

const jobsTheme = createTheme({
  palette: {
    primary: { main: brand.primary, dark: brand.primaryDark, contrastText: "#FFFFFF" },
    secondary: { main: brand.accent, contrastText: "#FFFFFF" },
    success: { main: brand.accent }, // keep palette small: reuse accent for success
    background: { default: brand.offWhite, paper: "#FFFFFF" },
    text: { primary: brand.ink, secondary: brand.inkMuted },
    divider: "rgba(32,176,166,0.18)",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontWeightBold: 700,
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(32,176,166,0.18)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 9999 },
        containedPrimary: { boxShadow: "none" },
        outlinedPrimary: { borderColor: "rgba(32,176,166,0.5)" },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorSecondary: { backgroundColor: "rgba(32,176,166,0.12)", color: brand.accent },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "box-shadow .2s, transform .2s",
        },
      },
    },
  },
})

export default function JobScraperPage() {
  const [params, setParams] = useState<ScrapeParams>({
    site_name: ["indeed", "linkedin"],
    search_term: "Web Developer",
    google_search_term: "web developer jobs in New York since last 10 days",
    location: "Remote",
    results_wanted: 25,
    hours_old: 240,
    country_indeed: "USA",
  })

  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Only filter by site
  const [filterSite, setFilterSite] = useState<string[]>([])
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null)

  // Modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleSiteChange = (siteId: string, checked: boolean) => {
    setParams((prev) => ({
      ...prev,
      site_name: checked
        ? [...prev.site_name, siteId]
        : prev.site_name.filter((site) => site !== siteId),
    }))
  }

  const handleScrapeJobs = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:8000/api/scrape-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error("Failed to scrape jobs")
      }

      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setJobs([
        {
          id: "1",
          title: "Senior React Developer",
          company: "TechCorp Inc.",
          location: "Remote",
          date_posted: "2 days ago",
          job_url: "https://example.com/job/1",
          description:
            "We are looking for a senior React developer with 5+ years of experience in building scalable web applications. You'll work with our dynamic team to create innovative solutions.",
          salary: "$80,000 - $120,000",
          site: "indeed",
          is_remote: true,
          job_type: "Full Time",
        },
        {
          id: "2",
          title: "Full Stack Web Developer",
          company: "StartupXYZ",
          location: "New York, NY",
          date_posted: "1 day ago",
          job_url: "https://example.com/job/2",
          description:
            "Join our dynamic team as a full stack developer. Work with React, Node.js, and modern technologies to build cutting-edge applications.",
          salary: "$70,000 - $100,000",
          site: "linkedin",
          is_remote: false,
          job_type: "Contract",
        },
        {
          id: "3",
          title: "Frontend Developer",
          company: "Digital Agency",
          location: "San Francisco, CA",
          date_posted: "3 days ago",
          job_url: "https://example.com/job/3",
          description:
            "We need a creative frontend developer to join our team. Experience with React, TypeScript, and modern CSS frameworks required.",
          site: "zip_recruiter",
          is_remote: false,
          job_type: "Part Time",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = useMemo(() => {
    if (!filterSite.length) return jobs
    return jobs.filter((job) => filterSite.includes(job.site))
  }, [jobs, filterSite])

  const openJobModal = (job: Job) => {
    setSelectedJob(job)
    setModalOpen(true)
  }
  const closeJobModal = () => {
    setModalOpen(false)
    setSelectedJob(null)
  }

  // Filter icon handlers
  const handleFilterIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget)
  }
  const handleFilterPopoverClose = () => {
    setFilterAnchorEl(null)
  }
  const filterPopoverOpen = Boolean(filterAnchorEl)

  return (
    <ThemeProvider theme={jobsTheme}>
      <Navbar />
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="lg">
          <Stack spacing={4}>
            {/* Header */}
            <Box
              textAlign="center"
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                py: { xs: 6, md: 8 },
                px: { xs: 4, md: 8 },
                borderRadius: 4,
              }}
            >
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                Job Scraper
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Find jobs across multiple platforms with ease
              </Typography>
            </Box>

            {/* Search Parameters */}
            <Paper elevation={0} sx={{ p: 3, bgcolor: "background.paper" }}>
              <Box display="flex" alignItems="center" mb={3}>
                <SearchIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2" fontWeight="medium">
                  Search Parameters
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6} sx={{ width: '48%' }}>
                  <TextField
                    fullWidth
                    label="Search Term"
                    value={params.search_term}
                    onChange={(e) => setParams((prev) => ({ ...prev, search_term: e.target.value }))}
                    placeholder="e.g., Web Developer"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ width: '48%' }}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={params.location}
                    onChange={(e) => setParams((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Remote, New York, NY"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ width: '22%' }}>
                  <TextField
                    fullWidth
                    label="Results Wanted"
                    type="number"
                    value={params.results_wanted}
                    onChange={(e) =>
                      setParams((prev) => ({ ...prev, results_wanted: Number.parseInt(e.target.value) || 25 }))
                    }
                    inputProps={{ min: 1, max: 100 }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ width: '24%' }}>
                  <TextField
                    fullWidth
                    label="Hours Old (max age)"
                    type="number"
                    value={params.hours_old}
                    onChange={(e) =>
                      setParams((prev) => ({ ...prev, hours_old: Number.parseInt(e.target.value) || 240 }))
                    }
                    inputProps={{ min: 1 }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ width: '48%' }}>
                  <TextField
                    fullWidth
                    label="Country (for Indeed)"
                    value={params.country_indeed}
                    onChange={(e) => setParams((prev) => ({ ...prev, country_indeed: e.target.value }))}
                    placeholder="e.g., USA, UK, Canada"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Google Search Term (optional)"
                    value={params.google_search_term}
                    onChange={(e) => setParams((prev) => ({ ...prev, google_search_term: e.target.value }))}
                    placeholder="e.g., web developer jobs in New York since last 10 days"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  Job Sites
                </Typography>
                <FormGroup row>
                  {availableSites.map((site) => (
                    <FormControlLabel
                      key={site.id}
                      control={
                        <Checkbox
                          checked={params.site_name.includes(site.id)}
                          onChange={(e) => handleSiteChange(site.id, e.target.checked)}
                          color="primary"
                        />
                      }
                      label={site.label}
                    />
                  ))}
                </FormGroup>
              </Box>

              <Box mt={4}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleScrapeJobs}
                  disabled={loading || params.site_name.length === 0}
                  startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                  sx={{ py: 1.5 }}
                >
                  {loading ? "Scraping Jobs..." : "Scrape Jobs"}
                </Button>
              </Box>
            </Paper>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" variant="filled">
                <Typography variant="body1" fontWeight="medium">
                  Error: {error}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Note: This demo shows mock data since the Python backend isn't connected yet.
                </Typography>
              </Alert>
            )}

            {/* Results */}
            {filteredJobs.length > 0 && (
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h5" component="h2" fontWeight="medium">
                    Found {filteredJobs.length} Jobs
                  </Typography>
                  <IconButton
                    onClick={handleFilterIconClick}
                    color="primary"
                    size="large"
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      ml: 2,
                    }}
                  >
                    <FilterAltIcon />
                  </IconButton>
                  <Popover
                    open={filterPopoverOpen}
                    anchorEl={filterAnchorEl}
                    onClose={handleFilterPopoverClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    sx={{ zIndex: 1301 }}
                  >
                    <Box sx={{ p: 2, minWidth: 200 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Filter by Site
                      </Typography>
                      <FormGroup>
                        {availableSites.map((site) => (
                          <FormControlLabel
                            key={site.id}
                            control={
                              <Checkbox
                                checked={filterSite.includes(site.id)}
                                onChange={(e) =>
                                  setFilterSite((prev) =>
                                    e.target.checked
                                      ? [...prev, site.id]
                                      : prev.filter((s) => s !== site.id)
                                  )
                                }
                                color="primary"
                              />
                            }
                            label={site.label}
                          />
                        ))}
                      </FormGroup>
                    </Box>
                  </Popover>
                </Box>

                <Stack spacing={3}>
                  {filteredJobs.map((job) => (
                    <Card
                      key={job.id}
                      elevation={0}
                      sx={{
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                        "&:hover": {
                          boxShadow: 4,
                          transform: "translateY(-2px)",
                        },
                        cursor: "pointer",
                      }}
                      onClick={() => openJobModal(job)}
                    >
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Typography variant="h6" component="h3" fontWeight="medium" color="primary">
                            {job.title}
                          </Typography>
                          <Chip label={job.site} size="small" color="secondary" />
                        </Box>

                        <Stack direction="row" spacing={3} mb={2} flexWrap="wrap">
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <BusinessIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {job.company}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <LocationIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {job.location}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <ScheduleIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {job.date_posted}
                            </Typography>
                          </Box>
                          {typeof job.is_remote === "boolean" && (
                            <Chip
                              label={job.is_remote ? "Remote" : "Onsite"}
                              color={job.is_remote ? "success" : "default"}
                              size="small"
                            />
                          )}
                          {job.job_type && <Chip label={job.job_type} color="primary" size="small" />}
                        </Stack>

                        {job.salary && (
                          <Typography variant="body2" color="success.main" fontWeight="medium" mb={1}>
                            {job.salary}
                          </Typography>
                        )}

                        {job.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {job.description}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          href={job.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          endIcon={<LaunchIcon />}
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Job
                        </Button>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            openJobModal(job)
                          }}
                          endIcon={<PreviewIcon />}
                        >
                          Preview Job
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </Stack>
              </Paper>
            )}

            {/* Job Details Modal */}
            <Dialog open={modalOpen} onClose={closeJobModal} maxWidth="md" fullWidth>
              <DialogTitle>
                {selectedJob?.title}
                <Chip label={selectedJob?.site} size="small" color="secondary" sx={{ ml: 2 }} />
              </DialogTitle>
              <DialogContent dividers>
                {selectedJob ? (
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Company:
                      </Typography>
                      <Typography variant="body1">{selectedJob.company}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Location:
                      </Typography>
                      <Typography variant="body1">{selectedJob.location}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Date Posted:
                      </Typography>
                      <Typography variant="body1">{selectedJob.date_posted}</Typography>
                    </Box>
                    {selectedJob.salary && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Salary:
                        </Typography>
                        <Typography variant="body1">{selectedJob.salary}</Typography>
                      </Box>
                    )}
                    {selectedJob.job_type && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Job Type:
                        </Typography>
                        <Typography variant="body1">{selectedJob.job_type}</Typography>
                      </Box>
                    )}
                    {typeof selectedJob.is_remote === "boolean" && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Remote:
                        </Typography>
                        <Typography variant="body1">{selectedJob.is_remote ? "Remote" : "Onsite"}</Typography>
                      </Box>
                    )}
                    <Divider />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Description:
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                        {selectedJob.description}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Full Details:
                      </Typography>
                      <Stack spacing={1}>
                        {Object.entries(selectedJob).map(
                          ([key, value]) =>
                            value && (
                              <Box key={key}>
                                <Typography variant="caption" color="text.secondary">
                                  {key.replace(/_/g, " ")}:
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                  {String(value)}
                                </Typography>
                              </Box>
                            ),
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                ) : null}
              </DialogContent>
              <DialogActions>
                {selectedJob?.job_url && (
                  <Button
                    variant="contained"
                    color="primary"
                    href={selectedJob.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<PreviewIcon />}
                  >
                    Preview Job
                  </Button>
                )}
                <Button onClick={closeJobModal} variant="outlined">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </ThemeProvider>
  )
}