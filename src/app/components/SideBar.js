import React, { useState } from 'react';
import Link from 'next/link';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DescriptionIcon from '@mui/icons-material/Description';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const drawerWidth = 240;

export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // true on screens < md (960px)
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ textAlign: 'center', width: '100%'}}>
          CareerCatalyst
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="../Pages/Resume">
              <ListItemIcon><DescriptionIcon /></ListItemIcon>
              <ListItemText primary="Resume Generator" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} href="/browse-courses">
              <ListItemIcon><SchoolIcon /></ListItemIcon>
              <ListItemText primary="Browse Courses" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} href="/job-search">
              <ListItemIcon><WorkIcon /></ListItemIcon>
              <ListItemText primary="Job Search" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} href="/interview-prep">
              <ListItemIcon><QuestionAnswerIcon /></ListItemIcon>
              <ListItemText primary="Interview Prep" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </>
  );

  return (
    <>
      {/* Show hamburger icon only on mobile */}
      {isMobile && (
        <IconButton
          color="black"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ ml: 2, mt: 1 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Mobile Drawer (Temporary) */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            [`& .MuiDrawer-paper`]: { width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* Desktop Drawer (Permanent) */
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
