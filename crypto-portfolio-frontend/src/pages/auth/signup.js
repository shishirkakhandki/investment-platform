import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Container, Typography, Grid, Box } from '@mui/material';
import apiClient from '../../../utils/api';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', userId: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.userId || !formData.password) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      await apiClient.post('/workflow/signup', formData); // Updated endpoint
      setErrorMessage('');
      router.push('/auth/login');
    } catch (err) {
      console.error("Signup error", err.response?.data?.message || err.message);
      setErrorMessage(err.response?.data?.message || 'Signup failed. Please try again.');
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
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="username"
                label="Username"
                variant="outlined"
                required
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="userId"
                label="User Id"
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
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}
