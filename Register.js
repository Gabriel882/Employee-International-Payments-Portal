import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './AuthStyles.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    accountNumber: '',
    password: '',
    role: 'customer', // Default role
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

    const { name, idNumber, accountNumber, password, role } = formData;

    // Validation
    if (!name || name.trim().length < 3) {
      setErrorMessage('Name must be at least 3 characters long.');
      return;
    }

    const namePattern = /^[a-zA-Z\s\-']+$/;
    if (!namePattern.test(name)) {
      setErrorMessage('Name must only contain letters, spaces, hyphens, or apostrophes.');
      return;
    }

    if (!/^\d{13}$/.test(idNumber)) {
      setErrorMessage('ID number must be exactly 13 digits.');
      return;
    }

    if (!/^\d{10}$/.test(accountNumber)) {
      setErrorMessage('Account number must be exactly 10 digits.');
      return;
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordPattern.test(password)) {
      setErrorMessage(
        'Password must be at least 8 characters long, with at least 1 uppercase letter, 1 number, and 1 special character (!@#$%^&*).'
      );
      return;
    }

    // Sanitize and prepare data
    const sanitizedFormData = {
      name: DOMPurify.sanitize(name),
      idNumber: DOMPurify.sanitize(idNumber),
      accountNumber: DOMPurify.sanitize(accountNumber),
      password: DOMPurify.sanitize(password),
      role: DOMPurify.sanitize(role),
    };

    try {
      const response = await axios.post('https://localhost/api/auth/register', sanitizedFormData, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log(response.data);
      alert('Registration successful! Redirecting to login...');
      navigate('/login');
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        setErrorMessage(DOMPurify.sanitize(error.response.data.message));
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="idNumber"
          placeholder="ID Number (13 digits)"
          value={formData.idNumber}
          onChange={handleChange}
        />

        <input
          type="text"
          name="accountNumber"
          placeholder="Account Number (10 digits)"
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

       

        <button type="submit">Register</button>

        <p className="switch-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Register;
