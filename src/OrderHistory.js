import React, { useEffect, useState } from 'react';
import { db } from './firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const storedEmail = localStorage.getItem('token'); // Get logged-in user's email

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, 'cartorders');
        const querySnapshot = await getDocs(ordersRef);
        const fetchedOrders = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(order => order.deliveryDetails.email === storedEmail); // Filter by logged-in email

        setOrders(fetchedOrders);
        console.log("Fetched Orders:", fetchedOrders); // Debugging: Check if images are fetched
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [storedEmail]);

  return (
    <div className="order-history-container">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order_card">
            <h3>Order ID: {order.id}</h3>
            <p><strong>Name:</strong> {order.deliveryDetails.name}</p>
            <p><strong>Email:</strong> {order.deliveryDetails.email}</p>
            <p><strong>Phone:</strong> {order.deliveryDetails.phone}</p>
            <p><strong>Address:</strong> {order.deliveryDetails.address}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
            <div className="order-items">
              <h4>Ordered Items:</h4>
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img 
                    src={item.imageUrl} 
                    alt={item.itemName} 
                    className="order-item-img" 
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Image"; }} // Fallback image
                  />
                  <p><strong>{item.itemName}</strong></p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: ₹{item.totalPrice}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
