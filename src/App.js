import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from "./Page/Login";
import Signup from "./Page/SignUp";
import DashboardPage from "./Page/Dashboard";
import EditProfile from "./Page/EditUser";
import Resume from "./Page/Resume/Dashboard";
import EditResume from "./Page/Resume/edit-resume/[resume_id]/EditResume";
import ViewResume from "./Page/Resume/view-resume/[resume_id]/ViewResume";
import { AuthProvider } from "./lib/auth-context"; // Adjust path if needed
import ProtectedRoute from "./lib/protectedRoute"; // Adjust path if needed
import ProfileSetup from "./Page/EmployeeSetup";
import LandingPage from "./Page/landing-page";
import FindJobs from "./Page/FindJobs";
import CareerPathPredictor from "./Page/career-path-predictor";
import RecommendSkills from "./Page/Recommend-Skill-Training";
import InterviewPrep from "./Page/Interview-prep";
import QuizComponent from "./components/QuizComponent";
import MCQsPage from "./Page/McqPage";
import MockInterviewPage from "./Page/Interview"
import EmployerSetup from "./Page/EmployerSetup";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <Resume />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resumes/:resumeId"
            element={
              <ProtectedRoute>
                <EditResume />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-resumes/:resumeId"
            element={
              <ProtectedRoute>
                <ViewResume />
              </ProtectedRoute>
            }
          />
          <Route
            path="/find-jobs"
            element={
              <ProtectedRoute>
                <FindJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-path-predictor"
            element={
              <ProtectedRoute>
                <CareerPathPredictor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Recommend-Skill-Training"
            element={
              <ProtectedRoute>
                <RecommendSkills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-prep"
            element={
              <ProtectedRoute>
                <InterviewPrep />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mcqs"
            element={
              <ProtectedRoute>
                <MCQsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <MockInterviewPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employer-setup"
            element={
              <ProtectedRoute>
                <EmployerSetup />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;