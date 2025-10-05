import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../lib/auth-context"; // Adjust path if needed

const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: "#004D40",
  boxShadow: "none",
}));
const NavButton = styled(Button)(({ active }) => ({
  color: "white",
  marginLeft: "8px",
  marginRight: "8px",
  textTransform: "none",
  fontSize: "15px",
  fontWeight: 500,
  padding: "6px 8px",
  minWidth: "auto",
  position: "relative",
  transition: "all 0.3s ease",
  "&::after": {
    content: '""',
    position: "absolute",
    width: active ? "70%" : "0",
    height: "2px",
    bottom: "0",
    left: "50%",
    backgroundColor: "white",
    transition: "all 0.3s ease",
    transform: "translateX(-50%)",
    opacity: active ? 1 : 0,
  },
  "&:hover": {
    backgroundColor: "transparent",
    transform: "translateY(-3px)",
    "&::after": {
      width: "70%",
      opacity: 1,
    },
  },
}));
const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
});
const LogoImage = styled("img")({
  height: "80px",
  marginTop: "10px",
  marginRight: "-18px",
});
const LogoText = styled(Typography)({
  color: "white",
  fontWeight: "bold",
  fontSize: "20px",
});
const LoginButton = styled(Button)(() => ({
  color: "white",
  border: "1px solid white",
  borderRadius: "4px",
  padding: "5px 16px",
  marginLeft: "10px",
  textTransform: "none",
  fontSize: "14px",
  fontWeight: 500,
  height: "32px",
  borderColor: "#00A389",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#00A389",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
}));
const RegisterButton = styled(Button)(() => ({
  borderColor: "#00A389",
  backgroundColor: "#00A389",
  color: "white",
  borderRadius: "4px",
  padding: "5px 16px",
  marginLeft: "10px",
  textTransform: "none",
  fontSize: "14px",
  fontWeight: 500,
  height: "32px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#00897B",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
}));

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAlert, setOpenAlert] = useState(false); // For login alert
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, signOut } = useAuth();

  const userName = currentUser?.displayName || currentUser?.email || "User";
  const avatarUrl = currentUser?.photoURL || "/static/images/avatar/1.jpg";

  const isActive = (path) => location.pathname === path;

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  // Only allow home page if not logged in
  const protectedNav = (path) => {
    if (!currentUser && path !== "/") {
      setOpenAlert(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      navigate(path);
      setDrawerOpen(false);
    }
  };

  const handleNavigation = (path) => {
    protectedNav(path);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const menuItems = [
    { text: "Home", href: "/" },
    { text: "Find Jobs", href: "/find-jobs" },
    { text: "Resume Builder", href: "/resume" },
    { text: "Interview Preparation", href: "/interview-prep" },
    { text: "Career Path Predictor", href: "/career-path-predictor" },
  ];

  const drawer = (
    <Box sx={{ width: 280 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.href)}
            sx={{
              backgroundColor: isActive(item.href) ? "rgba(0, 163, 137, 0.1)" : "transparent",
              borderLeft: isActive(item.href) ? "4px solid #00A389" : "none",
              transition: "all 0.3s ease",
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {currentUser ? (
          <>
            <ListItem sx={{ mt: 2 }}>
              <Box display="flex" alignItems="center" width="100%">
                <Avatar alt={userName} src={avatarUrl} sx={{ width: 32, height: 32, mr: 1 }} />
                <Typography variant="body2" color="text.primary" sx={{ flexGrow: 1 }}>
                  {userName}
                </Typography>
              </Box>
            </ListItem>
            <ListItem>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={handleLogout}
              >
                Logout
              </Button>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem sx={{ mt: 2 }}>
              <LoginButton variant="outlined" fullWidth onClick={() => handleNavigation("/login")}>
                Login
              </LoginButton>
            </ListItem>
            <ListItem sx={{ mt: 1 }}>
              <RegisterButton variant="contained" fullWidth onClick={() => handleNavigation("/register")}>
                Register
              </RegisterButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 0.5, minHeight: "60px" }}>
            <LogoContainer sx={{ flexGrow: isMobile ? 1 : 0 }} onClick={() => navigate("/")}>
              <LogoImage src="/white-logo-noBG.png" alt="CareerCatalyst Icon" />
              <LogoText>CareerCatalyst</LogoText>
            </LogoContainer>

            {isMobile ? (
              <>
                <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} size="small">
                  <MenuIcon />
                </IconButton>
                <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                  {drawer}
                </Drawer>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1, alignItems: "center" }}>
                  {menuItems.map((item) => (
                    <NavButton
                      key={item.text}
                      onClick={() => handleNavigation(item.href)}
                      active={isActive(item.href)}
                    >
                      {item.text}
                    </NavButton>
                  ))}
                </Box>
                <Box>
                  {currentUser ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="body1" sx={{ mr: 2 }}>
                        {userName}
                      </Typography>
                      <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                      >
                        <Avatar alt={userName} src={avatarUrl} />
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleMenuClose} component={Link} to="/edit-profile">
                          Profile Settings
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                          Logout
                        </MenuItem>
                      </Menu>
                    </Box>
                  ) : (
                    <>
                      <LoginButton variant="outlined" onClick={() => handleNavigation("/login")}>
                        Login
                      </LoginButton>
                      <RegisterButton variant="contained" onClick={() => handleNavigation("/register")}>
                        Register
                      </RegisterButton>
                    </>
                  )}
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>
      <Snackbar open={openAlert} autoHideDuration={1200} onClose={() => setOpenAlert(false)}>
        <Alert severity="warning" sx={{ width: "100%" }}>
          Please login first to access this page!
        </Alert>
      </Snackbar>
    </>
  );
}