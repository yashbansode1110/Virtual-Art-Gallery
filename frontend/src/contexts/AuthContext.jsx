import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on page load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Set axios default headers for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user data
          const { data } = await axios.get('/api/auth/profile');
          setUser(data);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      
      // Save token to local storage
      localStorage.setItem('token', data.token);
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      setUser(data);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      // Save token to local storage
      localStorage.setItem('token', data.token);
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      setUser(data);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
    
    // Remove axios default headers
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    toast.info('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (userData, profileImage) => {
    try {
      // Create form data for file upload
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (userData[key]) formData.append(key, userData[key]);
      });
      
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      
      const { data } = await axios.put('/api/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update token if returned
      if (data.token) {
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }
      
      setUser(data);
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Profile update failed');
      return false;
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 