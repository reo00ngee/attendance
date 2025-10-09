import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Container,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";

const AdminRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (password !== passwordConfirmation) {
      alert("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/admin/administrators`,
        {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Admin registered successfully!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Registration failed:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join("\n");
        alert(`Registration failed:\n${errorMessages}`);
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Admin Registration
      </Typography>

        <Paper
          sx={{
            p: 4,
            mt: 3,
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
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
              label="Confirm Password"
              type={showPasswordConfirmation ? "text" : "password"}
              fullWidth
              sx={{ mb: 3 }}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password confirmation visibility"
                      onClick={() => setShowPasswordConfirmation((show) => !show)}
                      edge="end"
                      size="small"
                    >
                      {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
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
              {loading ? "Registering..." : "Register Admin"}
            </Button>
          </form>
        </Paper>
    </Container>
  );
};

export default AdminRegistration;

