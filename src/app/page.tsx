"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import './globals.css';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left Side - Brand Name */}
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            CareerCatalyst
          </Typography>

          {/* Center - Navigation Links */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit">Services</Button>
            <Button color="inherit">About</Button>
          </Box>

          {/* Right Side - Login Button with Redirect */}
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => router.push("Pages/Login")}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
