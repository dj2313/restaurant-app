import React, { useState, useEffect } from "react";
import "./onlineorder.css";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const OnlineOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const paymentOptions = [
    { id: 'card', label: 'Credit/Debit Card' },
    { id: 'upi', label: 'UPI Payment' },
    { id: 'cod', label: 'Cash on Delivery' }
  ];

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, "user_orders");
        const snapshot = await getDocs(ordersRef);
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort orders by date (newest first)
        const sortedOrders = orders.sort((a, b) => 
          new Date(b.orderDate) - new Date(a.orderDate)
        );
        setAllOrders(sortedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const refreshOrders = async () => {
    try {
      const ordersRef = collection(db, "user_orders");
      const snapshot = await getDocs(ordersRef);
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const sortedOrders = orders.sort((a, b) => 
        new Date(b.orderDate) - new Date(a.orderDate)
      );
      setAllOrders(sortedOrders);
    } catch (error) {
      console.error("Error refreshing orders:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value.trim() // Trim whitespace
    }));
  };

  const validateForm = () => {
    try {
      if (!orderDetails) {
        throw new Error("No order details found");
      }
  
      // Validate required order details
      if (!orderDetails.id || !orderDetails.price || !orderDetails.quantity) {
        throw new Error("Invalid order details");
      }
  
      // Validate customer info
      const trimmedInfo = {
        name: customerInfo.name.trim(),
        email: customerInfo.email.trim(),
        phone: customerInfo.phone.trim(),
        address: customerInfo.address.trim()
      };
  
      if (!trimmedInfo.name || !trimmedInfo.email || !trimmedInfo.phone || !trimmedInfo.address) {
        throw new Error("Please fill in all fields");
      }
  
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedInfo.email)) {
        throw new Error("Please enter a valid email address");
      }
  
      // Validate phone
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(trimmedInfo.phone)) {
        throw new Error("Please enter a valid 10-digit phone number");
      }
  
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setError(null);
      setLoading(true);
  
      // Validate form first
      if (!validateForm()) {
        setLoading(false);
        return;
      }
  
      // Log order details for debugging
      console.log('Order Details:', orderDetails);
  
      // Validate order details structure
      if (!orderDetails || typeof orderDetails !== 'object') {
        throw new Error('Invalid order details structure');
      }
  
      // Create order data with default values and type checking
      const orderData = {
        orderItem: {
          id: orderDetails.id || '',
          name: String(orderDetails.name || ''),
          price: Number(orderDetails.price) || 0,
          quantity: Number(orderDetails.quantity) || 0,
          imageUrl: String(orderDetails.imageUrl || ''),
          description: String(orderDetails.description || '')
        },
        customerInfo: {
          name: String(customerInfo.name.trim()),
          email: String(customerInfo.email.trim().toLowerCase()),
          phone: String(customerInfo.phone.trim()),
          address: String(customerInfo.address.trim())
        },
        payment: {
          method: paymentMethod,
          status: paymentStatus,
          amount: parseFloat((orderDetails.price * orderDetails.quantity).toFixed(2)),
          timestamp: new Date().toISOString()
        },
        orderStatus: "pending",
        orderDate: new Date().toISOString(),
        createdAt: Date.now()
      };
  
      // Calculate total price
      orderData.orderItem.totalPrice = 
        parseFloat((orderData.orderItem.price * orderData.orderItem.quantity).toFixed(2));
  
      // Validate final order data
      if (orderData.orderItem.totalPrice <= 0) {
        throw new Error('Invalid order total');
      }
  
      // Log the final order data before saving
      console.log('Final Order Data:', orderData);
  
      // Save to Firestore
      const ordersRef = collection(db, "user_orders");
      
      // Use try-catch specifically for Firestore operation
      try {
        const docRef = await addDoc(ordersRef, orderData);
        console.log('Document written with ID: ', docRef.id);
  
        // Add new order to state with its ID
        const newOrder = {
          id: docRef.id,
          ...orderData
        };
  
        // Update local state
        setAllOrders(prevOrders => [newOrder, ...prevOrders]);
  
        // Reset form
        setCustomerInfo({
          name: "",
          email: "",
          phone: "",
          address: ""
        });
  
        // Show success message
        alert("Order placed successfully!");
        
        // Refresh orders list
        await refreshOrders();
  
      } catch (firestoreError) {
        console.error('Firestore Error:', firestoreError);
        throw new Error(`Failed to save to Firestore: ${firestoreError.message}`);
      }
  
    } catch (error) {
      console.error("Error placing order:", error);
      setError(error.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }
  
    try {
      setLoading(true);
      setPaymentStatus('processing');
  
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
  
      // Set payment as completed if not COD
      if (paymentMethod !== 'cod') {
        setPaymentStatus('completed');
      }
  
      // Place the order after payment
      await handlePlaceOrder();
      setShowPayment(false);
  
    } catch (error) {
      console.error("Payment failed:", error);
      setError("Payment failed. Please try again.");
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="order-container">Loading orders...</div>;
  }

  return (
    <div className="order-container">
      <h2 className="order-title">Orders Overview</h2>

      {error && <div className="error-message">{error}</div>}

      {/* New Order Form */}
      {orderDetails && (
        <div className="new-order-section">
          <h3>Place New Order</h3>
          <div className="order-content">
            <div className="selected-item-card">
              <h3>Selected Item</h3>
              <div className="item-details">
                <img 
                  src={orderDetails.imageUrl} 
                  alt={orderDetails.name} 
                  className="item-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                  }}
                />
                <div className="item-info">
                  <h4>{orderDetails.name}</h4>
                  <p>{orderDetails.description}</p>
                  <p className="quantity">Quantity: {orderDetails.quantity}</p>
                  <p className="price">Price per item: ₹{orderDetails.price.toFixed(2)}</p>
                  <p className="total">Total Amount: ₹{(orderDetails.totalPrice).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="customer-form">
              <h3>Delivery Information</h3>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="address"
                  placeholder="Delivery Address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              
              {/* Add before the place order button */}
              {showPayment && (
                <div className="payment-modal-overlay">
                  <div className="payment-modal">
                    <h3>Select Payment Method</h3>
                    <div className="payment-methods">
                      {paymentOptions.map(option => (
                        <label key={option.id} className="payment-option">
                          <input
                            type="radio"
                            name="payment"
                            value={option.id}
                            checked={paymentMethod === option.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                    
                    <div className="payment-summary">
                      <h4>Order Summary</h4>
                      <p>Total Amount: ₹{(orderDetails.totalPrice || 0).toFixed(2)}</p>
                    </div>

                    <div className="payment-actions">
                      <button 
                        className="cancel-btn"
                        onClick={() => setShowPayment(false)}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button 
                        className="confirm-btn"
                        onClick={handlePayment}
                        disabled={loading || !paymentMethod}
                      >
                        {loading ? "Processing..." : "Confirm Payment"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Replace the existing place order button */}
              <button 
                className="place-order-btn"
                onClick={() => {
                  if (validateForm()) {
                    setShowPayment(true);
                  }
                }}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Orders List */}
      <div className="all-orders-section">
        <div className="orders-header">
          <h3>Your Orders</h3>
          <button className="refresh-btn" onClick={refreshOrders}>
            Refresh Orders
          </button>
        </div>
        <div className="orders-grid">
          {allOrders.length === 0 ? (
            <p>No orders found. Start ordering from our menu!</p>
          ) : (
            allOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className={`status ${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                  <span className="order-date">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="order-item-details">
                  <img 
                    src={order.orderItem.imageUrl}
                    alt={order.orderItem.name}
                    className="order-item-image"
                  />
                  <div className="order-info">
                    <h4>{order.orderItem.name}</h4>
                    <p>Quantity: {order.orderItem.quantity}</p>
                    <p>Price per item: ₹{order.orderItem.price.toFixed(2)}</p>
                    <p className="total-price">
                      Total: ₹{(order.orderItem.totalPrice || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="delivery-info">
                  <h4>Delivery Details</h4>
                  <p>{order.customerInfo.name}</p>
                  <p>{order.customerInfo.phone}</p>
                  <p>{order.customerInfo.address}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OnlineOrder;