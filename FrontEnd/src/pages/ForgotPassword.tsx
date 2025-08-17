import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationAlert from "../components/NotificationAlert";
import { useNotification } from "../hooks/useNotification";
import LoadingSpinner from "../components/LoadingSpinner";

const ForgotPassword: React.FC = () => {
  const { notification, showNotification, clearNotification } = useNotification();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      showNotification('Please enter your email address.', 'error');
      return;
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);
    clearNotification();

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/send_reset_link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Password reset instructions have been queued and will be sent to your email shortly.', 'success');
      } else {
        showNotification(data.message || 'Failed to send reset instructions.', 'error');
      }
    } catch (err) {
      showNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your email address and we'll send you instructions to reset your password.
          </Typography>
        </Box>

        {/* 通知アラート */}
        <NotificationAlert notification={notification} />

        <LoadingSpinner loading={loading} />


        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            autoComplete="email"
            autoFocus
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 1 }}
          >
            Send Reset Link
          </Button>

          <Button
            variant="text"
            fullWidth
            onClick={handleBackToLogin}
            disabled={loading}
          >
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;