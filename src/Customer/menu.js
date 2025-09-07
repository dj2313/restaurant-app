import React, { useEffect, useState } from "react";
import "./menu.css";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const menuCollectionRef = collection(db, "menuItems");
        const snapshot = await getDocs(menuCollectionRef);
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          price: parseFloat(doc.data().price) || 0,
        }));
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu items: ", error);
      }
    };
    fetchMenuItems();
  }, []);

  const handleButtonClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first!");
      navigate("/login");
    } else {
      navigate("/menu");
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setQuantity(1);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleOrderNow = () => {
    if (selectedItem) {
      const orderDetails = {
        ...selectedItem,
        quantity: quantity,
        totalPrice: selectedItem.price * quantity,
      };
      navigate("/onlineorder", { state: { orderDetails } });
    }
  };

  const handleAddToCart = async () => {
    const userEmail = localStorage.getItem("token"); 
    if (!userEmail) {
      alert("Please log in to add items to the cart.");
      return;
    }
  
    if (selectedItem) {
      try {
        const cartItem = {
          userEmail: userEmail,
          itemName: selectedItem.name,
          itemId: selectedItem.id,
          quantity: quantity,
          price: selectedItem.price,
          totalPrice: selectedItem.price * quantity,
          imageUrl: selectedItem.imageUrl,
        };
  
        await addDoc(collection(db, "cart"), cartItem);
        alert("Item added to cart successfully!");
        
        navigate("/cart");  
        
      } catch (error) {
        console.error("Error adding item to cart: ", error);
        alert("Failed to add item to cart. Please try again.");
      }
    }
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="menu-container">
      {Object.keys(groupedItems).map((category, index) => (
        <div key={index} className="menu-category">
          <h2 className="menu-title">{category}</h2>
          <div className="menu-grid">
            {groupedItems[category].map((item, idx) => (
              <div
                key={idx}
                className="menu-item"
                onClick={() => handleCardClick(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="menu-img"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=No+Image";
                  }}
                />
                <div className="menu-item-content">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span className="menu-price">
                    ₹{typeof item.price === "number" ? item.price.toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedItem.name}</h2>
            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.name}
              className="modal-img"
            />
            <p>{selectedItem.description}</p>
            <span className="menu-price">₹{selectedItem.price.toFixed(2)}</span>
            <div className="quantity-selector">
              <button onClick={decreaseQuantity}>-</button>
              <span>{quantity}</span>
              <button onClick={increaseQuantity}>+</button>
            </div>
            <div className="modal-buttons">
              <button className="add-to-cart" onClick={() => { 
                handleAddToCart(); 
                handleButtonClick(); 
              }}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
