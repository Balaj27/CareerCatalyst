"use client"

import { useState } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import EmployerLayout from "../components/Emp-Dashboard/EmployerLayout"
import DashboardOverview from "../components/Emp-Dashboard/DashboardOverview"
import PostJob from "../components/Emp-Dashboard/PostJobs"
import CandidatesList from "../components/Emp-Dashboard/CandidatesList"
import AnalyticsDashboard from "../components/Emp-Dashboard/AnalyticsDashboard"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a5f5f",
      light: "#4caf50",
      dark: "#0d4f4f",
    },
    secondary: {
      main: "#4caf50",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      },
    },
  },
})

function EmpDash() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardOverview />
      case "post-job":
        return <PostJob />
      case "candidates":
        return <CandidatesList />
      case "analytics":
        return <AnalyticsDashboard />
      case "messages":
        return (
          <div>
            <h2>Messages</h2>
            <p>Messages functionality coming soon...</p>
          </div>
        )
      default:
        return <DashboardOverview />
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EmployerLayout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderCurrentPage()}
      </EmployerLayout>
    </ThemeProvider>
  )
}

export default EmpDash
