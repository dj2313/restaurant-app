import React, { useEffect, useState } from "react";
import "./cart.css";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase/config";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// toast.configure();
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);
  const userEmail = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartCollectionRef = collection(db, "cart");
        const snapshot = await getDocs(cartCollectionRef);
        const items = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => item.userEmail === userEmail);
        setCartItems(items);
      } catch (error) {
        console.error("Error fetching cart items: ", error);
      }
    };
    fetchCartItems();
  }, [userEmail]);

  const handleQuantityChange = (e) => {
    setNewQuantity(parseInt(e.target.value));
  };
  
  const handleUpdateQuantity = async (item) => {
    if (newQuantity < 1) return;
    try {
      const itemRef = doc(db, "cart", item.id);
      const updatedTotalPrice = item.price * newQuantity;

      await updateDoc(itemRef, { quantity: newQuantity, totalPrice: updatedTotalPrice });

      setCartItems((prevItems) =>
        prevItems.map((i) => (i.id === item.id ? { ...i, quantity: newQuantity, totalPrice: updatedTotalPrice } : i))
      );

      setSelectedItem((prev) => ({ ...prev, quantity: newQuantity, totalPrice: updatedTotalPrice }));
    } catch (error) {
      console.error("Error updating quantity: ", error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, "cart", itemId));
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      setSelectedItem(null);
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setNewQuantity(item.quantity);
  };

  return (
    <div className="cart-container">
      <div className="cart-left">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div onClick={() => handleItemClick(item)} className="cart-item-content">
                <img src={item.imageUrl} alt={item.itemName} className="cart-img" />
                <div className="cart-item-details">
                  <h3>{item.itemName}</h3>
                  <p>₹{item.price.toFixed(2)}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
              <FaTrash className="delete-icon" onClick={() => handleDeleteItem(item.id)} />
            </div>
          ))
        )}
      </div>

      <div className="cart-right">
        {selectedItem ? (
          <>
            <img src={selectedItem.imageUrl} alt={selectedItem.itemName} />
            <h3>{selectedItem.itemName}</h3>
            <p>{selectedItem.description}</p>
            <p>Price: ₹{selectedItem.price.toFixed(2)}</p>
            <p>Total: ₹{(selectedItem.price * selectedItem.quantity).toFixed(2)}</p>

            <div className="cart-buttons">
              <input
                type="number"
                value={newQuantity}
                min="1"
                onChange={handleQuantityChange}
                className="quantity-input"
              />
              <div className="button-group">
                <button className="update-btn" onClick={() => handleUpdateQuantity(selectedItem)}>
                  Update 
                </button>
                {/* <button className="delete-btn" onClick={() => handleDeleteItem(selectedItem.id)}>
                  Delete 
                </button> */}
              </div>
            </div>
          </>
        ) : (
          <p>Select an item to see details</p>
        )}
      </div>

      {/* <div className="cart-bottom">
        <button  className="payment-btn" onClick={() => navigate("/payment")} >Confirm Order</button>
      </div> */}

<div className="cart-bottom">
  <button
    className="payment-btn"
    onClick={() => {
      if (cartItems.length === 0) {
        toast.error("Your cart is empty! Add items before proceeding.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          style: { backgroundColor: "red", color: "white" },
        });
      } else {
        navigate("/payment");
      }
    }}
    disabled={cartItems.length === 0}
    style={{
      backgroundColor: cartItems.length === 0 ? "#d3d3d3" : "#28a745",
      cursor: cartItems.length === 0 ? "not-allowed" : "pointer",
    }}
  >
    Confirm Order
  </button>
</div>

    </div>
  );
};

export default Cart;