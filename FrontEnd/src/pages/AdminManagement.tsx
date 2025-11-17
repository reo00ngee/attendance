import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Section from "../components/Section";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import NavigationButton from "../components/NavigationButton";
import NotificationAlert from "../components/NotificationAlert";
import { useNotification } from "../hooks/useNotification";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

const AdminManagement: React.FC = () => {
  const navigate = useNavigate();
  const { notification, showNotification, clearNotification } = useNotification();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [noAdmin, setNoAdmin] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    clearNotification();
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/admin/administrators`,
        { withCredentials: true }
      );
      setAdmins(response.data);
      setNoAdmin(response.data.length === 0);
    } catch (error: any) {
      console.error("Failed to fetch admins:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('admin');
        navigate("/admin/login");
      } else {
        showNotification("Failed to fetch admin list.", 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin: AdminUser) => {
    navigate(`/admin/registration?admin_id=${admin.id}`);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <PageTitle title="Admin Management" />

      {/* 通知アラート */}
      <NotificationAlert notification={notification} />

      {noAdmin && (
        <Section>
          <Alert severity="warning" sx={{ mb: 2 }}>
            There are no admins to display.
          </Alert>
        </Section>
      )}

      {/* loading時はローディング表示 */}
      <LoadingSpinner loading={loading} />

      <Section>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <NavigationButton
            variant="contained"
            to="/admin/registration"
            sx={{ minWidth: 180 }}
          >
            REGISTER
          </NavigationButton>
        </Box>
      </Section>

      {/* テーブル */}
      <Section>
        <TableContainer component={Paper} sx={{ opacity: loading ? 0.6 : 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell align="right">{admin.name}</TableCell>
                  <TableCell align="right">{admin.email}</TableCell>
                  <TableCell align="right">
                    <NavigationButton
                      variant="contained"
                      size="small"
                      to={`/admin/registration?admin_id=${admin.id}`}
                      sx={{
                        minWidth: 120,
                        height: 40,
                        fontSize: "1rem",
                        px: 2,
                      }}
                    >
                      Modify
                    </NavigationButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>
    </Box>
  );
};

export default AdminManagement;
