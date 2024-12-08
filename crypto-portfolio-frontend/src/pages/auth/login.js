import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import apiClient, { setAuthToken } from '../../../utils/api';

export default function Login() {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiClient.post('/workflow/login', formData); // Updated endpoint
      setAuthToken(data.token); // Set token for subsequent API requests
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err) {
      console.error("Login error", err.response?.data?.message || err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="User Id"
            name="userId"
            fullWidth
            margin="normal"
            required
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required
            onChange={handleChange}
          />
          <Box mt={4}>
            <Button variant="contained" color="primary" fullWidth type="submit">
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
