import React, { useState, useEffect } from 'react';
import { db } from './firebase/config';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'; 
import emailjs from 'emailjs-com';
import './Profile.css';

const Profile = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userData, setUserData] = useState({});
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [userDocId, setUserDocId] = useState(null); // Store document ID

    // Personal details state
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');

    // Fetch user email from localStorage
    useEffect(() => {
        const storedEmail = localStorage.getItem('token');
        if (storedEmail) {
            setUserEmail(storedEmail);
        } else {
            console.error('No logged-in user found in local storage');
        }
    }, []);

    // Fetch user data from Firestore based on email field
    useEffect(() => {
        const fetchUserData = async () => {
            if (!userEmail) return;
    
            try {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('email', '==', userEmail));
                const querySnapshot = await getDocs(q);
    
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0]; // Get the first matching document
                    setUserDocId(userDoc.id); // Store the document ID
                    const userData = userDoc.data();
                    setUserData(userData);
    
                    // Set states with default values if fields are missing
                    setProfilePicUrl(userData.profilePicUrl || '');
                    setName(userData.name || '');
                    setPhone(userData.phone || '');
                    setAddress(userData.address || '');
                } else {
                    console.warn('No user document found with matching email.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
    
        if (userEmail) {
            fetchUserData();
        }
    }, [userEmail]);

    // Save profile picture URL
    const saveProfilePicUrl = async () => {
        if (!profilePicUrl.trim()) {
            alert('Profile image URL is required');
            return;
        }
    
        if (!userDocId) {
            alert('User document not found.');
            return;
        }
    
        try {
            const userRef = doc(db, 'users', userDocId);
            await updateDoc(userRef, { profilePicUrl: profilePicUrl.trim() });

            setUserData(prev => ({ ...prev, profilePicUrl: profilePicUrl.trim() }));
            alert('Profile image updated successfully!');
            setShowProfileModal(false);
        } catch (error) {
            console.error('Error updating profile image:', error);
            alert('Failed to update profile image');
        }
    };

    // Handle OTP send
    const sendOtp = () => {
        const generated = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('otp', generated);
        setGeneratedOtp(generated);

        emailjs.send('service_owkf30m', 'template_vyh1mqo', {
            to_email: userEmail,
            otp: generated,
        }, 'ugBi0_c-kBY_rSsbw');

        alert('OTP sent to your email!');
    };

    // Handle OTP verification
    const verifyOtp = () => {
        const storedOtp = localStorage.getItem('otp');
        if (otp === storedOtp) {
            setOtpVerified(true);
            alert('OTP Verified! You can now update your password.');
        } else {
            alert('Incorrect OTP. Try again.');
        }
    };

    // Update profile details
    const updateDetails = async () => {
        if (!userEmail) {
            alert('User email is missing. Please log in again.');
            return;
        }

        if (!userDocId) {
            alert('User document not found.');
            return;
        }

        if (password && !otpVerified) {
            alert('Verify OTP before updating password.');
            return;
        }

        const updatedData = { name, phone, address };
        if (password) updatedData.password = password;

        try {
            const userRef = doc(db, 'users', userDocId);
            await updateDoc(userRef, updatedData);

            setUserData(prev => ({ ...prev, ...updatedData }));
            alert('Profile updated successfully!');
            setShowDetailsModal(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="profile-page">
        <div className="profile-container">
            <div className="profile-section">
                <img 
                    src={profilePicUrl || 'https://via.placeholder.com/150'} 
                    alt="Profile" 
                    className="profile-pic" 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image'}
                />
                <button onClick={() => setShowProfileModal(true)}>Update Profile</button>
            </div>
            <div className="details-section">
                <h3>Personal Details</h3>
                <p>Name: {userData?.name || 'Not Added'}</p>
                <p>Email: {userEmail}</p>
                <p>Phone: {userData?.phone || 'Not Added'}</p>
                <p>Address: {userData?.address || 'Not Added'}</p>
                <button onClick={() => setShowDetailsModal(true)}>Edit Details</button>
            </div>
            <div className="order-history">
                <button onClick={() => window.location.href='/order_history'}>View Order History</button>
            </div>

            {/* Profile Picture Modal */}
            {showProfileModal && (
                <div className="modal">
                    <input 
                        type="url" 
                        placeholder="Enter Profile Image URL" 
                        value={profilePicUrl} 
                        onChange={(e) => setProfilePicUrl(e.target.value)}
                    />
                    <button onClick={saveProfilePicUrl}>Save</button>
                    <button onClick={() => setShowProfileModal(false)}>Close</button>
                </div>
            )}

            {/* Edit Details Modal */}
            {showDetailsModal && (
                <div className="modal">
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={sendOtp}>Send OTP</button>
                    <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
                    <button onClick={verifyOtp}>Verify OTP</button>
                    <button onClick={updateDetails}>Update</button>
                    <button onClick={() => setShowDetailsModal(false)}>Close</button>
                </div>
            )}
        </div>
        </div>
    );
};

export default Profile;
