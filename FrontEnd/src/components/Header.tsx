import React, { useEffect, useState } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { getUserName } from "../utils/user";
import { UseLogout } from '../queryClient';
import { useNavigate } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { makePageLinks } from "../utils/pageLink";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [pageLinks, setPageLinks] = useState<{ label: string; path: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setPageLinks(makePageLinks());
  }, [localStorage.getItem("user")]);

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

  const logout = UseLogout();

  return (
    <AppBar position="static">
      <Toolbar>
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
              {pageLinks.map((page) => (
                <ListItem key={page.label} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(page.path);
                      handleDrawerClose();
                    }}
                  >
                    <ListItemText primary={page.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Typography
          variant="h6"
          component="a"
          href="/attendance_registration_for_monthly"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer',
          }}
        >
          Attendance Management Tool
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, marginRight: 2 }}>
          {pageLinks.map((page) => (
            <Button
              key={page.label}
              sx={{ color: 'white', marginLeft: 2 }}
              onClick={() => navigate(page.path)}
            >
              {page.label}
            </Button>
          ))}
        </Box>
        <Button
          color="inherit"
          startIcon={<AccountCircle />}
          onClick={handleMenuOpen}
          sx={{ textTransform: "none", minWidth: 120 }}
        >
          Account
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: { minWidth: 180 }
          }}
        >
          <MenuItem disabled>
            {getUserName()}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              logout.mutate();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
