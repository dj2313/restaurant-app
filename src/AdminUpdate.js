import React, { useState, useEffect } from "react";
import { db } from "./firebase/config";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import "./AdminUpdate.css";
import Admin_nav from './Admin_nav';

const AdminUpdate = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedItem, setUpdatedItem] = useState({
    name: "",
    category: "",
    price: "",
    imageUrl: "",
    description: ""
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "menuItems"));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(items);
    } catch (error) {
      alert("Error fetching menu items: " + error.message);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setUpdatedItem(item);
  };

  const handleChange = (e) => {
    setUpdatedItem({ ...updatedItem, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!updatedItem.name.trim()) {
      alert("Item name is required!");
      return false;
    }
    if (!updatedItem.category) {
      alert("Please select a category!");
      return false;
    }
    if (!updatedItem.price || isNaN(updatedItem.price) || parseFloat(updatedItem.price) <= 0) {
      alert("Price must be a number greater than 0!");
      return false;
    }
    if (!updatedItem.imageUrl.trim() || !updatedItem.imageUrl.startsWith("http")) {
      alert("Please enter a valid image URL starting with http or https!");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const itemRef = doc(db, "menuItems", selectedItem.id);
      await updateDoc(itemRef, {
        ...updatedItem,
        price: parseFloat(updatedItem.price) || 0,
      });
      alert("Menu Item Updated Successfully!");
      setSelectedItem(null);
      fetchMenuItems();
    } catch (error) {
      alert("Error updating menu item: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete "${selectedItem.name}"?`);
    if (!confirmDelete) return;

    try {
      const itemRef = doc(db, "menuItems", selectedItem.id);
      await deleteDoc(itemRef);
      alert("Menu Item Deleted Successfully!");
      setSelectedItem(null);
      fetchMenuItems();
    } catch (error) {
      alert("Error deleting menu item: " + error.message);
    }
  };

  return (
    <div>
      <Admin_nav />
      <div className="admin-update-container">
        <h2>Update Menu Items</h2>
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.id} onClick={() => handleItemClick(item)} className="menu-card">
              <img src={item.imageUrl} alt={item.name} className="card-image" />
              <div className="card-details">
                <h3>{item.name}</h3>
                <p>{item.category} - ₹{item.price}</p>
              </div>
            </li>
          ))}
        </ul>

        {selectedItem && (
          <>
            <div className="popup-overlay" onClick={() => setSelectedItem(null)} />
            <div className="update-popup">
              <button className="close-btn" onClick={() => setSelectedItem(null)}>×</button>
              <h2>Update Item</h2>
              <div className="popup-content">
                <div className="update-form">
                  <div className="form-group">
                    <label>Item Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={updatedItem.name || ''} 
                      onChange={handleChange} 
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select 
                      name="category" 
                      value={updatedItem.category || ''} 
                      onChange={handleChange}
                    >
                      <option value="" disabled>Select a category</option>
                      <option value="Appetizers">Appetizers</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input 
                      type="number" 
                      name="price" 
                      value={updatedItem.price || ''} 
                      onChange={handleChange} 
                      min="0" 
                      step="0.01"
                    />
                  </div>

                  <div className="form-group">
                    <label>Image URL</label>
                    <input 
                      type="url" 
                      name="imageUrl" 
                      value={updatedItem.imageUrl || ''} 
                      onChange={handleChange} 
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      name="description" 
                      value={updatedItem.description || ''} 
                      onChange={handleChange} 
                    />
                  </div>

                  <div className="button-group">
                    <button type="button" onClick={handleUpdate}>Update</button>
                    <button type="button" className="delete-btn" onClick={handleDelete}>Delete Item</button>
                  </div>
                </div>

                <div className="image-preview-container">
                  <img src={updatedItem.imageUrl} alt={updatedItem.name} className="image-preview" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUpdate;
