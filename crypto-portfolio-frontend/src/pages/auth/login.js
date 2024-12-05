import { TextField, Button, Container, Typography, Box } from "@mui/material";

export default function Login() {
  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form>
          <TextField label="Email" name="email" fullWidth margin="normal" required />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required
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
