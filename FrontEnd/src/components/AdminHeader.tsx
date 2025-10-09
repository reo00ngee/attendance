import React, { memo, useState, useEffect } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from "@mui/material/Box";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminHeader = memo(() => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adminName, setAdminName] = useState<string>("");

  const navigate = useNavigate();

  // Get admin name from localStorage
  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      const admin = JSON.parse(adminData);
      setAdminName(admin.name || "");
    }
  }, []);

  const adminPageLinks = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Register Admin", path: "/admin/registration" },
    { label: "Manage Admins", path: "/admin/management" },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleDrawerClose();
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/admin/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem('admin');
      navigate("/admin/login");
    }
    handleMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Menu Icon */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ marginRight: 2 }}
          onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>

        {/* Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerClose}
          variant="temporary"
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              top: '64px',
              height: 'calc(100% - 64px)',
            },
          }}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={handleDrawerClose}
            onKeyDown={handleDrawerClose}
          >
            <List>
              {adminPageLinks.map((page) => (
                <ListItem key={page.label} disablePadding>
                  <ListItemButton onClick={() => handleNavigate(page.path)}>
                    <ListItemText primary={page.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Title */}
        <Typography
          variant="h6"
          onClick={() => handleNavigate('/admin/dashboard')}
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer',
          }}
        >
          Admin Panel
        </Typography>

        {/* Account Icon */}
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>

        {/* Account Menu */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {adminName || "Admin"}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
});

export default AdminHeader;

