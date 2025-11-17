import React, { useState } from 'react'
import { UseLogin } from '../queryClient'
import TextField from '@mui/material/TextField';
import { Box, Button, Container, IconButton, InputAdornment } from '@mui/material'
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const login = UseLogin()
  const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    login.mutate({
      email: email,
      password: password,
    })
  }

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  }

  return (

    <>
      <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Box sx={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', textAlign: 'center', width: '400px' }}>
          <h2>Login</h2>
          <Box
            component="form"
            onSubmit={onSubmit}
            noValidate
            autoComplete="off"
            sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <TextField
              id="email"
              label="Email"
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
              <Button type="submit" variant="contained">Login</Button>
              <Button variant="outlined" onClick={handleForgotPassword}>
                Forgot password?
              </Button>
              <Button 
                variant="text" 
                onClick={() => navigate('/admin/login')}
                sx={{ color: '#1976d2' }}
              >
                Admin Login
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default Login