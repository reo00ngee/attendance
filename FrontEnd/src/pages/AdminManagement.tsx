import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

const AdminManagement: React.FC = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/admin/administrators`,
        { withCredentials: true }
      );
      setAdmins(response.data);
    } catch (error: any) {
      console.error("Failed to fetch admins:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('admin');
        navigate("/admin/login");
      } else {
        alert("Failed to fetch admin list.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAdmin) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}api/admin/administrators/${selectedAdmin.id}`,
        { withCredentials: true }
      );
      setAdmins(admins.filter(admin => admin.id !== selectedAdmin.id));
      setDeleteDialogOpen(false);
      setSelectedAdmin(null);
      alert("Admin deleted successfully.");
    } catch (error) {
      console.error("Failed to delete admin:", error);
      alert("Failed to delete admin.");
    }
  };

  const handleEdit = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setEditForm({
      name: admin.name,
      email: admin.email,
      password: "",
      password_confirmation: "",
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedAdmin) return;

    try {
      const updateData: any = {
        name: editForm.name,
        email: editForm.email,
      };

      if (editForm.password) {
        if (editForm.password !== editForm.password_confirmation) {
          alert("Passwords do not match.");
          return;
        }
        updateData.password = editForm.password;
        updateData.password_confirmation = editForm.password_confirmation;
      }

      await axios.put(
        `${process.env.REACT_APP_BASE_URL}api/admin/administrators/${selectedAdmin.id}`,
        updateData,
        { withCredentials: true }
      );

      await fetchAdmins();
      setEditDialogOpen(false);
      setSelectedAdmin(null);
      setEditForm({ name: "", email: "", password: "", password_confirmation: "" });
      alert("Admin information updated successfully.");
    } catch (error: any) {
      console.error("Failed to update admin:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join("\n");
        alert(`Update failed:\n${errorMessages}`);
      } else {
        alert("Failed to update admin information.");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Management
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.id}</TableCell>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    {new Date(admin.created_at).toLocaleDateString('en-US')}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(admin)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(admin)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Admin</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedAdmin?.name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Admin Information</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              required
            />
            <TextField
              label="New Password (optional)"
              type="password"
              fullWidth
              value={editForm.password}
              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={editForm.password_confirmation}
              onChange={(e) => setEditForm({ ...editForm, password_confirmation: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminManagement;
