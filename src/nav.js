import React, { useEffect, useState } from 'react';
import './nav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { db } from './firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Navbar = () => {
  const navigate = useNavigate();
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const userEmail = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfilePic = async () => {
      if (!userEmail) {
        // Set default image when user is not logged in
        setProfilePicUrl('https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg');
        return;
      }
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setProfilePicUrl(userData.profilePicUrl || 'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg');
        } else {
          setProfilePicUrl('https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg');
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
        setProfilePicUrl('https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg');
      }
    };

    fetchProfilePic();
  }, [userEmail]);

  const handleLogout = () => {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      alert('Logged out successfully!');
      navigate('/login');
    } else {
      alert('You are already logged out!');
    }
  };


  return (
    <div className="navbar-container">
      <nav className="navbar">
        <h1 className="logo">Dine Delight<span className="dot"></span></h1>
        <ul className="nav-links">
          <li><Link to='/home' className="navbar-link">Home</Link></li>
          <li><Link to='/menu' className="navbar-link">Menu</Link></li>
          <li><Link to='/service' className="navbar-link">Services</Link></li>
          <li><Link to='/features' className="navbar-link">Features</Link></li>
          <li><Link to='/About' className="navbar-link">About Us</Link></li>
        </ul>
        <div className="nav-buttons">
          <button className="login-icon" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
          <button className="login-icon" >
            <Link to='/cart'>
              <FontAwesomeIcon icon={faCartShopping} />
            </Link>
          </button>
          <Link to='/profile'>
            <img src={profilePicUrl} alt="Profile" className="profilepic" />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
