import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase/config";
import Admin_nav from './Admin_nav';
import "./AdminOrders.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrdersRef = collection(db, "user_orders");
        const cartOrdersRef = collection(db, "cartorders");
        
        const [userOrdersSnapshot, cartOrdersSnapshot] = await Promise.all([
          getDocs(userOrdersRef),
          getDocs(cartOrdersRef)
        ]);

        const userOrdersList = userOrdersSnapshot.docs?.map(doc => ({
          id: doc.id,
          source: 'user_orders',
          ...doc.data()
        })) || [];

        const cartOrdersList = cartOrdersSnapshot.docs?.map(doc => ({
          id: doc.id,
          source: 'cartorders',
          ...doc.data()
        })) || [];

        console.log("User Orders:", userOrdersList);
        console.log("Cart Orders:", cartOrdersList);

        const combinedOrders = [...userOrdersList, ...cartOrdersList];
        combinedOrders.sort((a, b) => new Date(a.createdAt?.toDate?.() || 0) - new Date(b.createdAt?.toDate?.() || 0));
        setOrders(combinedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus, source) => {
    try {
      const orderRef = doc(db, source, orderId);
      await updateDoc(orderRef, { orderStatus: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      ));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const cancelOrder = async (orderId, source) => {
    if (window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, source, orderId));
        setOrders(orders.filter(order => order.id !== orderId));
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const generateBill = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Order Bill", 14, 22);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 14, 30);
    doc.text(`Customer Name: ${order.customerInfo?.name || order.deliveryDetails?.name || 'N/A'}`, 14, 36);
    doc.text(`Email: ${order.customerInfo?.email || order.deliveryDetails?.email || 'N/A'}`, 14, 42);
    doc.text(`Phone: ${order.customerInfo?.phone || order.deliveryDetails?.phone || 'N/A'}`, 14, 48);
    doc.text(`Address: ${order.customerInfo?.address || order.deliveryDetails?.address || 'N/A'}`, 14, 54);
    doc.text(`Order Status: ${order.orderStatus}`, 14, 60);

    doc.autoTable({
      startY: 70,
      head: [['Item', 'Quantity', 'Price', 'Total']],
      body: (order.items || []).map(item => [
        item.itemName || item.name || 'N/A',
        item.quantity || 0,
        `₹${item.price?.toFixed(2) || 0}`,
        `₹${(item.price * item.quantity)?.toFixed(2) || 0}`
      ])
    });

    const grandTotal = (order.items || []).reduce((acc, item) => acc + (item.price * item.quantity || 0), 0);
    doc.text(`Total Amount: ₹${grandTotal.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);
    doc.save(`Order_${order.id}.pdf`);
  };

  if (loading) {
    return (
      <>
        <Admin_nav />
        <div className="admin-orders-container">
          <h2>Loading orders...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Admin_nav />
      <div className="admin-orders-container">
        <h2>Customer Orders</h2>
        <div className="orders-grid">
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.id.slice(-6)} {/*({order.source}) */}</h3>
                  <span className={`status ${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                </div>
                
                <div className="order-details">
                  <p><strong>Customer:</strong> {order.customerInfo?.name || order.deliveryDetails?.name || 'N/A'}</p>
                  <p><strong>Email:</strong> {order.customerInfo?.email || order.deliveryDetails?.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {order.customerInfo?.phone || order.deliveryDetails?.phone || 'N/A'}</p>
                  <p><strong>Address:</strong> {order.customerInfo?.address || order.deliveryDetails?.address || 'N/A'}</p>

                  <div className="order-items">
                    <h4>Items Ordered:</h4>
                    {(order.items || []).map((item, index) => (
                      <div className="item" key={index}>
                        <p>{item.itemName || item.name || 'N/A'} x {item.quantity || 0}</p>
                        <p>₹{item.price?.toFixed(2) || 0} each</p>
                      </div>
                    ))}
                  </div>

                  <p className="total-amount">
                    <strong>Total Amount:</strong> ₹{(order.totalAmount || (order.items || []).reduce((acc, item) => acc + (item.price * item.quantity || 0), 0)).toFixed(2)}
                  </p>
                </div>

                <div className="order-actions">
                  <select 
                    value={order.orderStatus}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value, order.source)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button onClick={() => generateBill(order)}>Generate Invoice</button>
                  <button onClick={() => cancelOrder(order.id, order.source)} className="cancel-button">Cancel Order</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AdminOrders;
