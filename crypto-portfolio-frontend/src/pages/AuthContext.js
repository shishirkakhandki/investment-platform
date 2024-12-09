import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi } from '../../utils/api'; // Import the login API function

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials); // Attempt the API login
      setUserId(credentials.userId);
      localStorage.setItem('userId', credentials.userId); // Store userId in localStorage
      return true; // Login successful
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Handle specific 401 Unauthorized error
        console.error('Login failed: Invalid credentials');
      } else {
        // Handle other types of errors
        console.error('Login failed: An unexpected error occurred', error);
      }
      return false; // Login failed
    }
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
