import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase/config";
import { useNavigate, Link } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const adminRef = collection(db, "admin_users");
      const q = query(adminRef, where("email", "==", adminData.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Admin not registered!");
        return;
      }

      const admin = querySnapshot.docs[0].data();
      if (admin.password !== adminData.password) {
        setError("Incorrect password!");
        return;
      }

      // Store login state
      localStorage.setItem("admin", JSON.stringify(admin));
      alert("Login successful!");
      navigate("/admin_dashboard"); 

    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    
    <div className="auth-container">
      <h2>Admin Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleLogin}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>
        {/* Not registered? <Link to="/admin_register">Register here</Link> */}
      </p>
    </div>
  );
};

export default AdminLogin;