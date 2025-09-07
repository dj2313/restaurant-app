import React, { useState } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase/config"; // Ensure correct Firestore import
import './AdminRegister.css';
import { Link } from "react-router-dom";
const AdminRegister = () => {
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const adminUsersRef = collection(db, "admin_users");
      const q = query(adminUsersRef, where("email", "==", adminData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("Email already registered!");
        setLoading(false);
        return;
      }

      await addDoc(adminUsersRef, {
        name: adminData.name,
        email: adminData.email,
        password: adminData.password,
        
      });

      alert("Admin registered successfully!");
      setAdminData({ name: "", email: "", password: "" }); // Reset form
    } catch (error) {
      console.error("Error registering admin:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={adminData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={adminData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={adminData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        
      </form>
      <p>
        Already Admin? <Link to="/admin_login">Click here</Link>
      </p>
    </div>
  );
};

export default AdminRegister;