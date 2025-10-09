import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import axios from "axios";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        // First, get admin info from local storage
        const localAdmin = localStorage.getItem('admin');
        if (localAdmin) {
          setAdmin(JSON.parse(localAdmin));
        }

        // Get admin info from server
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/admin/me`,
          { withCredentials: true }
        );
        setAdmin(response.data);
        localStorage.setItem('admin', JSON.stringify(response.data));
      } catch (error: any) {
        console.error("Failed to fetch admin info:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem('admin');
          navigate("/admin/login");
        } else {
          alert("Failed to fetch admin information.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminInfo();
  }, [navigate]);

  const handleAdminRegistration = () => {
    navigate("/admin/registration");
  };

  const handleAdminManagement = () => {
    navigate("/admin/management");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PersonAddIcon sx={{ mr: 1, fontSize: 40, color: "primary.main" }} />
                  <Typography variant="h5" component="h2">
                    Register Admin
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Create a new administrator account
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleAdminRegistration}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Register Admin
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PeopleIcon sx={{ mr: 1, fontSize: 40, color: "primary.main" }} />
                  <Typography variant="h5" component="h2">
                    Manage Admins
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Manage existing administrator accounts
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleAdminManagement}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Manage Admins
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Admin Information
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body1">
              <strong>Name:</strong> {admin?.name}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {admin?.email}
            </Typography>
            <Typography variant="body1">
              <strong>Registration Date:</strong> {admin?.created_at ? new Date(admin.created_at).toLocaleDateString('en-US') : 'N/A'}
            </Typography>
          </Box>
        </Paper>
    </Container>
  );
};

export default AdminDashboard;
