import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'username') {
      // Username validation: Minimum 5 characters, must include at least one letter, cannot be numbers only
      if (value.length < 5) {
        setErrorMessage('Username must be at least 5 characters long.');
      } else if (/^\d+$/.test(value)) {
        setErrorMessage('Username cannot be numbers only. It must include at least one letter.');
      } else {
        setErrorMessage(''); // Clear error when valid
      }
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (formData.username.length < 5 || /^\d+$/.test(formData.username)) {
      setErrorMessage('Invalid username. It must be at least 5 characters long and include at least one letter.');
      return;
    }

    try {
      // Check if email already exists
      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', formData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setErrorMessage('Email already registered');
        return;
      }

      // Add new user
      await addDoc(collection(db, 'users'), {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString()
      });

      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      setErrorMessage('Error registering user: ' + error.message);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <button type="submit">Register</button>
        <p className="register-link">Already registered? <span onClick={() => navigate('/login')}>Login account</span></p>
      </form>
    </div>
  );
}

export default Register;