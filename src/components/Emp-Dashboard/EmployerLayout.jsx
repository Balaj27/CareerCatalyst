"use client"

import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { Dashboard, Work, People, Analytics, Mail, Menu as MenuIcon, AccountCircle, Logout } from "@mui/icons-material"

const drawerWidth = 240

const EmployerLayout = ({ children, currentPage, onPageChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, key: "dashboard" },
    { text: "Post Job", icon: <Work />, key: "post-job" },
    { text: "Candidates", icon: <People />, key: "candidates" },
    { text: "Analytics", icon: <Analytics />, key: "analytics" },
    { text: "Messages", icon: <Mail />, key: "messages" },
  ]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const drawer = (
    <Box>
      <Box sx={{ p: 2, bgcolor: "#1a5f5f", color: "white" }}>
        <Typography variant="h6" component="div">
          CareerCatalyst
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Employer Portal
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              onClick={() => onPageChange(item.key)}
              sx={{
                bgcolor: currentPage === item.key ? "#e0f2f1" : "transparent",
                "&:hover": { bgcolor: "#f1f8e9" },
              }}
            >
              <ListItemIcon sx={{ color: currentPage === item.key ? "#1a5f5f" : "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: currentPage === item.key ? "#1a5f5f" : "inherit" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: "#1a5f5f",
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find((item) => item.key === currentPage)?.text || "Dashboard"}
          </Typography>
          <IconButton size="large" edge="end" onClick={handleProfileMenuOpen} color="inherit">
            <Avatar sx={{ bgcolor: "#4caf50" }}>E</Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
            <MenuItem onClick={handleProfileMenuClose}>
              <AccountCircle sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          bgcolor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default EmployerLayout
