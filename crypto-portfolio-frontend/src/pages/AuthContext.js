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
      const response = await loginApi(credentials); // Use the API function from api.js
      console.log('API response:', response);
      setUserId(credentials.userId);
      console.log('Setting userId in localStorage:', credentials.userId);
      localStorage.setItem('userId', credentials.userId); // Store in localStorage
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
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
