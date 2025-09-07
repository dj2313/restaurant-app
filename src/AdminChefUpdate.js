import React, { useState, useEffect } from "react";
import { db } from "./firebase/config";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import "./AdminUpdate.css";
import Admin_nav from './Admin_nav';

const AdminChefUpdate = () => {
  const [chefs, setChefs] = useState([]);
  const [selectedChef, setSelectedChef] = useState(null);
  const [updatedChef, setUpdatedChef] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    const querySnapshot = await getDocs(collection(db, "chefs"));
    const chefList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setChefs(chefList);
  };

  const handleChefClick = (chef) => {
    setSelectedChef(chef);
    setUpdatedChef(chef);
    setErrors({});
  };

  const handleChange = (e) => {
    setUpdatedChef({ ...updatedChef, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!updatedChef.name?.trim()) tempErrors.name = 'Name is required';
    if (!updatedChef.speciality?.trim()) tempErrors.speciality = 'Speciality is required';
    if (!updatedChef.description?.trim()) tempErrors.description = 'Description is required';
    if (updatedChef.description?.length > 500) tempErrors.description = 'Description must be under 500 characters';

    const urlPattern = /^(https?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+(?:[\/\w\.-]*)*$/;
    if (!urlPattern.test(updatedChef.imageUrl)) tempErrors.imageUrl = 'Invalid URL';

    setErrors(tempErrors);

    if (Object.keys(tempErrors).length > 0) {
      alert("Please enter details properly before updating.");
    }

    return Object.keys(tempErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (selectedChef && updatedChef && validate()) {
      try {
        const chefRef = doc(db, "chefs", selectedChef.id);
        await updateDoc(chefRef, updatedChef);
        alert("Chef details updated successfully!");
        setSelectedChef(null);
        fetchChefs();
      } catch (error) {
        console.error("Error updating chef details:", error);
        alert("Error updating chef details: " + error.message);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedChef && window.confirm("Are you sure you want to delete this chef?")) {
      try {
        const chefRef = doc(db, "chefs", selectedChef.id);
        await deleteDoc(chefRef);
        alert("Chef deleted successfully!");
        setSelectedChef(null);
        fetchChefs();
      } catch (error) {
        console.error("Error deleting chef:", error);
        alert("Error deleting chef: " + error.message);
      }
    }
  };

  return (
    <div>
      <Admin_nav />
      <div className="admin-update-container">
        <h2>Update Chef Details</h2>
        <ul className="menu-list">
          {chefs.map((chef) => (
            <li key={chef.id} onClick={() => handleChefClick(chef)} className="menu-card">
              <img src={chef.imageUrl} alt={chef.name} className="card-image" />
              <div className="card-details">
                <h3>{chef.name}</h3>
                <p>{chef.speciality}</p>
              </div>
            </li>
          ))}
        </ul>

        {selectedChef && (
          <>
            <div className="popup-overlay" onClick={() => setSelectedChef(null)} />
            <div className="update-popup">
              <button className="close-btn" onClick={() => setSelectedChef(null)}>×</button>
              <h2>Update Chef</h2>
              <div className="popup-content">
                <div className="update-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value={updatedChef.name} onChange={handleChange} />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label>Speciality</label>
                    <input type="text" name="speciality" value={updatedChef.speciality} onChange={handleChange} />
                    {errors.speciality && <span className="error-text">{errors.speciality}</span>}
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input type="url" name="imageUrl" value={updatedChef.imageUrl} onChange={handleChange} />
                    {errors.imageUrl && <span className="error-text">{errors.imageUrl}</span>}
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={updatedChef.description} onChange={handleChange} />
                    {errors.description && <span className="error-text">{errors.description}</span>}
                  </div>
                  <div className="button-group">
                    <button type="button" onClick={handleUpdate}>Update</button>
                    <button type="button" className="delete-btn" onClick={handleDelete}>Delete Chef</button>
                  </div>
                </div>
                <div className="image-preview-container">
                  <img src={updatedChef.imageUrl} alt={updatedChef.name} className="image-preview" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminChefUpdate;
