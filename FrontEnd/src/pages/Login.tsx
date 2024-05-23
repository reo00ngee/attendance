import React, { useState } from 'react'
import { UseLogin } from '../queryClient'
import TextField from '@mui/material/TextField';
import { Box, Button, Container } from '@mui/material'


const Login: React.FC = () => {
  const login = UseLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    login.mutate({
      email: email,
      password: password,
    })
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
              type="password"
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="current-password"
              required
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <Button type="submit" variant="contained">Login</Button>
              <Button variant="outlined">Forgot password?</Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default Login