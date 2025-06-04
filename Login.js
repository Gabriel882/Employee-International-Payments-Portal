import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './AuthStyles.css';

const Login = () => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.accountNumber || !formData.password) {
      setErrorMessage('Please fill in both fields.');
      return;
    }

    const sanitizedFormData = {
      accountNumber: DOMPurify.sanitize(formData.accountNumber),
      password: DOMPurify.sanitize(formData.password),
    };

  


    try {
      const response = await axios.post('https://localhost/api/auth/login', sanitizedFormData);

      const token = response.data.token;
      const role = response.data.role;

      // Store token
      localStorage.setItem('token', token);
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      alert('Login successful');

      // Redirect by role
      if (role === 'employee') {
        navigate(role === 'employee' ? '/employee/dashboard' : '/dashboard');
      }else {
        navigate('/dashboard');
      }

    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(DOMPurify.sanitize(error.response.data.message));
      } else {
        setErrorMessage('Login failed. Please check your credentials and try again.');
      }
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          value={formData.accountNumber}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Login</button>

        <p className="switch-link">
          Don't have an account? <span onClick={() => navigate('/register')}>Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
