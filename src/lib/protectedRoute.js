
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth-context";
import { sendEmailVerification } from "firebase/auth";

/**
 * Usage:
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 */
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const [resendStatus, setResendStatus] = React.useState("");

  // While loading, don't render children or redirect (prevents flicker)
  if (loading) return null;

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleResend = async () => {
    setResendStatus("");
    try {
      await sendEmailVerification(currentUser);
      setResendStatus("Verification email sent!");
    } catch (err) {
      setResendStatus("Failed to send email. Try again later.");
    }
  };

  if (!currentUser.emailVerified) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#004D40",
        color: "white"
      }}>
        <h2>Email Verification Required</h2>
        <p>Please check your inbox and verify your email address to continue.</p>
        <button
          style={{
            background: "#00A389",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "10px 24px",
            fontWeight: "bold",
            marginTop: "16px"
          }}
          onClick={() => window.location.reload()}
        >
          I've Verified My Email
        </button>
        <button
          style={{
            background: "#00897B",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "10px 24px",
            fontWeight: "bold",
            marginTop: "12px"
          }}
          onClick={handleResend}
        >
          Resend Verification Email
        </button>
        {resendStatus && <p style={{ marginTop: 8 }}>{resendStatus}</p>}
      </div>
    );
  }


  // If authenticated and verified, render the children (protected page)
  return children;
}

export default ProtectedRoute;