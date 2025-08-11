import React, { memo, useEffect, useState, useMemo, useCallback } from "react";
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

const Header = memo(() => {
  // userをstateで管理
  const [user, setUser] = useState(localStorage.getItem("user"));
  
  // 他のstate...
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [informationAnchorEl, setInformationAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [informations, setInformations] = useState<Information[]>([]);
  const [informationLoading, setInformationLoading] = useState(false);

  const navigate = useNavigate();
  const logout = UseLogout();

  // localStorage変更の監視
  useEffect(() => {
    const handleStorage = () => setUser(localStorage.getItem("user"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ページリンクを直接メモ化（setPageLinksを削除）
  const pageLinks = useMemo(() => makePageLinks(), [user]);

  // Information取得関数をメモ化
  const fetchInformations = useCallback(async () => {
    if (informationLoading) return;
    
    setInformationLoading(true);
    try {
      const cacheKey = 'informations_cache';
      const cacheTimeKey = 'informations_cache_time';
      const cacheTime = sessionStorage.getItem(cacheTimeKey);
      const now = Date.now();
      
      // 2分以内のキャッシュがあれば使用
      if (cacheTime && (now - parseInt(cacheTime)) < 2 * 60 * 1000) {
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
          setInformations(JSON.parse(cachedData));
          return;
        }
      }

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
        
        // キャッシュに保存
        sessionStorage.setItem(cacheKey, JSON.stringify(data || []));
        sessionStorage.setItem(cacheTimeKey, now.toString());
      } else {
        console.error("Failed to fetch information");
      }
    } catch (error) {
      console.error("Error fetching information:", error);
    } finally {
      setInformationLoading(false);
    }
  }, [informationLoading]);

  // 初回とその後の定期取得
  useEffect(() => {
    fetchInformations();
    const interval = setInterval(fetchInformations, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchInformations]);

  // ハンドラー関数をメモ化
  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleInformationOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setInformationAnchorEl(event.currentTarget);
    if (!informationLoading) {
      fetchInformations();
    }
  }, [fetchInformations, informationLoading]);

  const handleInformationClose = useCallback(() => {
    setInformationAnchorEl(null);
  }, []);

  const handleDrawerOpen = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  // 汎用的なナビゲーションハンドラー
  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleMenuClick = useCallback((path: string) => {
    navigate(path);
    handleDrawerClose();
  }, [navigate]);

  const handleLogout = useCallback(() => {
    handleMenuClose();
    logout.mutate();
  }, [logout]);

  const informationCount = useMemo(() => informations.length, [informations.length]);

  return (
    <AppBar position="static">
      <Toolbar>
        {/* MenuIcon */}
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
              {pageLinks.map((page) => (
                <ListItem key={page.label} disablePadding>
                  <ListItemButton
                    onClick={() => handleMenuClick(page.path)}
                  >
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
          onClick={() => handleNavigate('/attendance_registration_for_monthly')}
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer',
          }}
        >
          Attendance Management Tool
        </Typography>

        {/* Information Icon */}
        <IconButton
          size="large"
          color="inherit"
          onClick={handleInformationOpen}
          sx={{ marginRight: 1 }}
        >
          <Badge
            variant={informationCount > 0 ? "dot" : undefined}
            color="error"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Account Button */}
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
          <MenuItem onClick={handleLogout}>
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
          {informationLoading ? (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                Loading...
              </Typography>
            </MenuItem>
          ) : informationCount === 0 ? (
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
                      <span>{info.user_name}.</span>
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
                {index < informationCount - 1 && <Divider />}
              </Box>
            ))
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
