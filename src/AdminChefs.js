import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase/config";
import Admin_nav from './Admin_nav';
import "./AdminChefs.css";
import { Link } from 'react-router-dom';

const AdminChefs = () => {
  const [chefData, setChefData] = useState({
    name: "",
    speciality: "",
    experience: "",
    imageUrl: "",
    description: ""
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError({ ...error, [name]: "" }); // Clear error for the field being changed

    setChefData(prev => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value) || '' : value
    }));

    if (name === 'imageUrl') {
      setPreviewUrl(value);
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!chefData.name.trim()) {
      errors.name = "Chef name is required";
    } else if (!/^[A-Za-z\s]+$/.test(chefData.name)) {
      errors.name = "Name should only contain letters and spaces";
    }

    if (!chefData.speciality.trim()) {
      errors.speciality = "Speciality is required";
    } else if (!/^[A-Za-z\s]+$/.test(chefData.speciality)) {
      errors.speciality = "Speciality should only contain letters and spaces";
    }

    if (!chefData.experience || chefData.experience <= 0) {
      errors.experience = "Please enter valid years of experience";
    }

    if (!chefData.imageUrl.trim()) {
      errors.imageUrl = "Image URL is required";
    } else if (!/^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)$/.test(chefData.imageUrl.trim())) {
      errors.imageUrl = "Enter a valid image URL (png, jpg, jpeg, gif, webp)";
    }

    if (!chefData.description.trim()) {
      errors.description = "Description is required";
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const chefsRef = collection(db, "chefs");
      const chefToAdd = {
        name: chefData.name.trim(),
        speciality: chefData.speciality.trim(),
        experience: parseInt(chefData.experience),
        imageUrl: chefData.imageUrl.trim(),
        description: chefData.description.trim(),
        createdAt: new Date().toISOString()
      };

      await addDoc(chefsRef, chefToAdd);

      alert("Chef added successfully!");
      setChefData({
        name: "",
        speciality: "",
        experience: "",
        imageUrl: "",
        description: ""
      });
      setPreviewUrl("");
    } catch (error) {
      console.error("Error adding chef:", error);
      setError({ general: "Failed to add chef. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Admin_nav />
      <div className="admin-chefs-container">
        <h2>Add New Chef</h2>
        {error.general && <div className="error-message">{error.general}</div>}
        {error.name && <div className="error-message">{error.name}</div>}
        {error.speciality && <div className="error-message">{error.speciality}</div>}
        {error.experience && <div className="error-message">{error.experience}</div>}
        {error.imageUrl && <div className="error-message">{error.imageUrl}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Chef Name</label>
            <input
              type="text"
              name="name"
              value={chefData.name}
              onChange={handleChange}
              placeholder="Enter chef's name"
              
            />
            
          </div>

          <div className="form-group">
            <label>Speciality</label>
            <input
              type="text"
              name="speciality"
              value={chefData.speciality}
              onChange={handleChange}
              placeholder="Enter chef's speciality"
              
            />
            
          </div>

          <div className="form-group">
            <label>Experience (years)</label>
            <input
              type="number"
              name="experience"
              value={chefData.experience}
              onChange={handleChange}
              placeholder="Years of experience"
              min="0"
              
            />
            
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={chefData.imageUrl}
              onChange={handleChange}
              placeholder="Enter chef's image URL"
            
            />
            
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={chefData.description}
              onChange={handleChange}
              placeholder="Enter chef's description"
              
            />
            
          </div>

          {previewUrl && (
            <div className="image-preview">
              <h3>Image Preview</h3>
              <img 
                src={previewUrl} 
                alt="Chef preview" 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image+URL';
                  setError({ ...error, imageUrl: "Invalid image URL. Please check the URL." });
                }}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Adding Chef..." : "Add Chef"}
          </button>
          <button type="submit" className="submit-btn1">
            <Link to='/admin_chefUpdate'>Update Chef</Link>
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminChefs;
