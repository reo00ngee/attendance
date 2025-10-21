import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { Box, Button, Container, IconButton, InputAdornment } from '@mui/material'
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from 'react-router-dom';
import { UseAdminLogin } from '../hooks/useAdminLogin';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const adminLogin = UseAdminLogin();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    adminLogin.mutate({
      email: email,
      password: password,
    }, {
      onSuccess: (data) => {
        console.log('Login successful:', data);
        navigate('/admin/company_management');
      },
      onError: (error: any) => {
        console.error('Login failed:', error);
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
      }
    });
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
                disabled={adminLogin.isPending}
                sx={{ backgroundColor: '#1976d2' }}
              >
                {adminLogin.isPending ? 'Logging in...' : 'Login'}
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
