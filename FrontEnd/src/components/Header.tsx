import React, { useEffect, useState } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getUserName } from "../utils/user";
import { UseLogout } from '../queryClient';
import { useNavigate } from "react-router-dom";
import { makePageLinks } from "../utils/pageLink";
import { Information } from "../types/Information";
import {
  getSubmissionTypeLabel,
  getInformationTypeMessage,
} from "../utils/informationUtils";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [informationAnchorEl, setInformationAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [pageLinks, setPageLinks] = useState<{ label: string; path: string }[]>([]);

  // Information関連のstate
  const [informations, setInformations] = useState<Information[]>([]);

  const navigate = useNavigate();
  const logout = UseLogout();

  useEffect(() => {
    setPageLinks(makePageLinks());
  }, [localStorage.getItem("user")]);

  // Information取得のuseEffect
  useEffect(() => {
    const fetchInformations = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/get_informations`, {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setInformations(data || []);
          console.log(informations);
        } else {
          console.error("Failed to fetch information");
        }
      } catch (error) {
        console.error("Error fetching information:", error);
      }
    };

    fetchInformations();

    // 5分おきにinformationを再取得
    const interval = setInterval(fetchInformations, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleInformationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setInformationAnchorEl(event.currentTarget);
  };

  const handleInformationClose = () => {
    setInformationAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

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

        {/* Information アイコン */}
        <IconButton
          size="large"
          color="inherit"
          onClick={handleInformationOpen}
          sx={{ marginRight: 1 }}
        >
          <Badge
            variant={informations.length > 0 ? "dot" : undefined}
            color="error"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Button
          color="inherit"
          startIcon={<AccountCircle />}
          onClick={handleMenuOpen}
          sx={{ textTransform: "none", minWidth: 120 }}
        >
          Account
        </Button>

        {/* Account Menu */}
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

        {/* Information Menu */}
        <Menu
          anchorEl={informationAnchorEl}
          open={Boolean(informationAnchorEl)}
          onClose={handleInformationClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              minWidth: 350,
              maxWidth: 400,
              maxHeight: 400,
              overflow: 'auto'
            }
          }}
        >
          {informations.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                No information
              </Typography>
            </MenuItem>
          ) : (
            informations.map((info, index) => (
              <Box key={info.information_id}>
                <MenuItem
                  sx={{
                    whiteSpace: 'normal',
                    display: 'block',
                    py: 1.5
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {getSubmissionTypeLabel(info.submission_type)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {getInformationTypeMessage(info.information_type)}
                    {info.information_type === 1 && info.user_name && (
                      <span>{info.user_name} .</span>
                    )}
                  </Typography>
                  {info.comment && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      Rejected Reason: {info.comment}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {new Date(info.created_at).toLocaleString()}
                  </Typography>
                </MenuItem>
                {index < informations.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
