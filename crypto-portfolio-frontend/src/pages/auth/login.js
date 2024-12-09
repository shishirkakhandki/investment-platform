import { useRouter } from 'next/router';
import { useAuth } from '../AuthContext';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      userId: e.target.userId.value,
      password: e.target.password.value,
    };

    const success = await login(formData);
    if (success) {
      console.log("Success")
      setTimeout(() => router.push('/dashboard'), 100);// Redirect to dashboard
    } else {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="userId" placeholder="User ID" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}
