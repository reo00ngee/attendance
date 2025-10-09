import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { Box, Button, Container, IconButton, InputAdornment } from '@mui/material'
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Attempting admin login with:', { email, password: '***' });
      console.log('API URL:', `${process.env.REACT_APP_BASE_URL}api/admin/login`);
      
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/admin/login`, 
        { email, password }, 
        { withCredentials: true }
      );
      console.log('Login successful:', response);
      
      // Save admin info after successful login
      if (response.data.admin) {
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
      }
      
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      if (error.response?.data?.error) {
        alert(`Login failed: ${error.response.data.error}`);
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        alert(`Login failed:\n${errorMessages}`);
      } else if (error.response?.status === 404) {
        alert('Admin login API not found. Please check if the server is running.');
      } else if (error.response?.status === 500) {
        alert('Server error occurred. Please check if the admin table exists.');
      } else {
        alert(`Login failed. Status: ${error.response?.status || 'Unknown'}`);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleBackToUserLogin = () => {
    navigate('/login');
  }

  return (
    <>
      <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Box sx={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', textAlign: 'center', width: '400px' }}>
          <h2>Admin Login</h2>
          <Box
            component="form"
            onSubmit={onSubmit}
            noValidate
            autoComplete="off"
            sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <TextField
              id="email"
              label="Email Address"
              type="email"
              onChange={e => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="email"
              required
            />
            <TextField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="current-password"
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                sx={{ backgroundColor: '#1976d2' }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleBackToUserLogin}
                sx={{ color: '#1976d2', borderColor: '#1976d2' }}
              >
                Back to User Login
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default AdminLogin
