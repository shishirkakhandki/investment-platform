import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Container, Typography, Box, Grid } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      userId: e.target.userId.value.trim(),
      password: e.target.password.value,
    };
  
    if (!formData.userId || !formData.password) {
      setErrorMessage('All fields are required.');
      return;
    }
  
    const success = await login(formData);
    if (success) {
      setErrorMessage('');
      setTimeout(() => router.push('/dashboard'), 100); // Redirect to dashboard
    } else {
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };
  

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="userId"
                label="User ID"
                variant="outlined"
                required
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                required
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            {errorMessage && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2">
                  {errorMessage}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" color="primary">
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}
