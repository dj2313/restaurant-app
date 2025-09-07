import React, { useState } from "react";
import { db } from "./firebase/config";
import { collection, addDoc } from "firebase/firestore";
import "./AdminMenu.css";
import Admin_nav from './Admin_nav';
import { Link } from 'react-router-dom';


const AdminMenu = () => {
  const [menuItem, setMenuItem] = useState({
    name: "",
    category: "",
    price: "",
    imageUrl: "",
    description: ""
  
  });
  const [previewUrl, setPreviewUrl] = useState("");

  const handleChange = (e) => {
    setMenuItem({ ...menuItem, [e.target.name]: e.target.value });
    if (e.target.name === 'imageUrl') {
      setPreviewUrl(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!menuItem.name || !menuItem.category || !menuItem.price || !menuItem.imageUrl) {
      alert("Please fill all fields");
      return;
    }

    try {
      const menuRef = collection(db, "menuItems");
      const docRef = await addDoc(menuRef, {
        ...menuItem,
        price: parseFloat(menuItem.price) || 0,
        createdAt: new Date().toISOString()
      });

      if (docRef.id) {
        alert("Menu Item Added Successfully!");
        setMenuItem({
          name: "",
          category: "",
          price: "",
          imageUrl: "",
          description: ""
        });
        setPreviewUrl("");
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Error adding menu item: " + error.message);
    }
  };

  return (
    <div>
      <Admin_nav />
      <div className="admin-menu-container">
        <h2>Add Menu Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              name="name"
              value={menuItem.name}
              onChange={handleChange}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={menuItem.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
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
              value={menuItem.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              step="0.05"
              required
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={menuItem.imageUrl}
              onChange={handleChange}
              placeholder="Enter image URL"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="textarea"
              name="description"
              value={menuItem.description}
              onChange={handleChange}
              placeholder="Enter Product Description"
              required
            />
          </div>

          {previewUrl && (
            <div className="image-preview">
              <h3>Image Preview</h3>
              <img src={previewUrl} alt="Preview" />
            </div>
          )}

          <button type="submit" className="submit-btn">
            Add Menu Item
          </button>
          <button type="submit" className="submit-btn1"><Link to='/admin_update'>
          Update Menu Item</Link>
            
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default AdminMenu;