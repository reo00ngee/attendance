import React from "react";
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


const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = UseLogout();

  const pages = ['Home', 'About', 'Services', 'Contact'];

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ marginRight: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Attendance Management Tool
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, marginRight: 2 }}>
          {pages.map((page) => (
            <Button key={page} sx={{ color: 'white', marginLeft: 2 }}>
              {page}
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
