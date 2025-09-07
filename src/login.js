import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase/config';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import emailjs from 'emailjs-com';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', formData.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        if (userData.password === formData.password) {
          localStorage.setItem('token', userData.email);
          alert('Login successful!');
          navigate('/home');
        } else {
          setErrorMessage('Invalid credentials');
        }
      } else {
        setErrorMessage('User not found');
      }
    } catch (error) {
      setErrorMessage('Error logging in: ' + error.message);
    }
  };

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendOtp = async () => {
    const otpCode = generateOtp();
    setGeneratedOtp(otpCode);
    setIsOtpSent(true);
    const templateParams = { to_email: formData.email, otp: otpCode };
    try {
      await emailjs.send('service_owkf30m', 'template_vyh1mqo', templateParams, 'ugBi0_c-kBY_rSsbw');
      alert('OTP sent to your email!');
    } catch (error) {
      setErrorMessage('Error sending OTP: ' + error.message);
    }
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setIsOtpVerified(true);
      alert('OTP verified! You can now reset your password.');
    } else {
      setErrorMessage('Invalid OTP. Please try again.');
    }
  };

  const updatePassword = async () => {
    if (!isOtpVerified) {
      setErrorMessage('Please verify OTP first.');
      return;
    }
    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', formData.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].ref;
        await updateDoc(userDoc, { password: newPassword });
        alert('Password updated successfully!');
        navigate('/');
      } else {
        setErrorMessage('User not found');
      }
    } catch (error) {
      setErrorMessage('Error updating password: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <div className="eml">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        {!isOtpSent ? (
          <>
            <div className="pswd">
              <label>Password:</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit">Login</button>
            <p className="register-link">Not registered? <span onClick={() => navigate('/register')}>Create an account</span></p>
            <p className="register-link">Login as Admin <span onClick={() => navigate('/admin_login')}>From here</span></p>
            <p className="register-link"> <span onClick={sendOtp}>Reset Password here</span></p>
          </>
        ) : (
          <div className="otp-section">
            <input 
              type="text" 
              placeholder="Enter OTP" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              className="otp-input"
            />
            <button type="button" onClick={verifyOtp}>Verify OTP</button>
            {isOtpVerified && (
              <div className="reset-password-section">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="password-input"
                />
                <button type="button" onClick={updatePassword}>Update Password</button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;