import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import Section from "../components/Section";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import NotificationAlert from "../components/NotificationAlert";
import NavigationButton from '../components/NavigationButton';
import { useNotification } from "../hooks/useNotification";

const AdminRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const adminId = searchParams.get("admin_id");
  const pageTitle = adminId ? "Admin Modification" : "Admin Registration";
  
  const { notification, showNotification, clearNotification } = useNotification();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  // 編集時は既存データを取得
  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      clearNotification();
      try {
        if (adminId) {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}api/admin/administrators/${adminId}`,
            { withCredentials: true }
          );
          setName(response.data.name);
          setEmail(response.data.email);
        }
      } catch (error: any) {
        console.error("Failed to fetch admin:", error);
        showNotification("Failed to fetch admin information.", 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [adminId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (password !== confirm) {
      showNotification("Passwords do not match.", 'error');
      setLoading(false);
      return;
    }

    if (!adminId && password.length < 8) {
      showNotification("Password must be at least 8 characters long.", 'error');
      setLoading(false);
      return;
    }

    try {
      if (adminId) {
        // 編集モード
        const updateData: any = { name, email };
        if (password) {
          updateData.password = password;
          updateData.password_confirmation = confirm;
        }

        await axios.put(
          `${process.env.REACT_APP_BASE_URL}api/admin/administrators/${adminId}`,
          updateData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        showNotification("Admin updated successfully!", 'success');
      } else {
        // 新規作成モード
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}api/admin/administrators`,
          {
            name,
            email,
            password,
            password_confirmation: confirm,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        showNotification("Admin registered successfully!", 'success');
      }
    } catch (error: any) {
      console.error("Operation failed:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join("\n");
        showNotification(`Operation failed:\n${errorMessages}`, 'error');
      } else {
        showNotification("Operation failed. Please try again.", 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <PageTitle title={pageTitle} />

      {/* 通知アラート */}
      <NotificationAlert notification={notification} />

      {/* loading時はローディング表示 */}
      <LoadingSpinner loading={loading} />

      <Section>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <NavigationButton
            variant="contained"
            to="/admin/management"
            sx={{ minWidth: 180 }}
          >
            ADMIN MANAGEMENT
          </NavigationButton>
        </Box>
      </Section>

      <Section>
        <Paper
          sx={{
            p: 4,
            maxWidth: 500,
            mx: "auto",
            opacity: loading ? 0.6 : 1,
            pointerEvents: loading ? "none" : "auto",
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Admin Name"
              fullWidth
              sx={{ mb: 2 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              sx={{ mb: 2 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label={adminId ? "New Password (optional)" : "Password"}
              type={showPassword ? "text" : "password"}
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!adminId}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label={adminId ? "Confirm New Password" : "Confirm Password"}
              type={showConfirm ? "text" : "password"}
              fullWidth
              sx={{ mb: 3 }}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required={!adminId}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password confirmation visibility"
                      onClick={() => setShowConfirm((show) => !show)}
                      edge="end"
                      size="small"
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? (adminId ? "Updating..." : "Registering...") : (adminId ? "Update" : "Register")}
            </Button>
          </form>
        </Paper>
      </Section>
    </Box>
  );
};

export default AdminRegistration;

