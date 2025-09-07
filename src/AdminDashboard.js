import React, { useEffect, useState } from "react";
import { db } from "./firebase/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import * as XLSX from "xlsx";
import './AdminDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrash, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import Admin_nav from './Admin_nav';
import emailjs from "emailjs-com";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [cartOrders, setCartOrders] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchCartOrders();
    fetchReservations();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCartOrders = async () => {
    try {
      const cartOrdersRef = collection(db, "cartorders");
      const cartOrdersSnapshot = await getDocs(cartOrdersRef);
      const cartOrdersList = cartOrdersSnapshot.docs.map(doc => {
        const data = doc.data();
  
        // 🔴 Debugging Log
        console.log("Raw Firestore Data:", data);
  
        return {
          id: doc.id,
          orderstatus: data.orderstatus || "Pending",
          paymentMethod: data.paymentMethod || "N/A",
          timestamp: data.timestamp?.toDate().toLocaleString() || "N/A",
          totalamount: data.totalamount ?? "Missing", // Ensure the value is retrieved
          deliveryDetails: {
            address: data.deliveryDetails?.address || "N/A",
            email: data.deliveryDetails?.email || "N/A",
            phone: data.deliveryDetails?.phone || "N/A",
            name: data.deliveryDetails?.name || "N/A"
          },
          items: data.items || []
        };
      });
  
      console.log("Processed Cart Orders:", cartOrdersList); // Log final processed data
      setCartOrders(cartOrdersList);
    } catch (error) {
      console.error("Error fetching cart orders:", error);
    }
  };

  const fetchReservations = async () => {
    try {
      const reservationsRef = collection(db, "reservations");
      const reservationsSnapshot = await getDocs(reservationsRef);
      const reservationsList = reservationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReservations(reservationsList);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const exportCartOrdersToExcel = () => {
    const data = cartOrders.map(order => {
      console.log("Order Total Amount Before Export:", order.totalamount); // Debugging log
      
      return {
        OrderID: order.id,
        OrderStatus: order.orderstatus,
        PaymentMethod: order.paymentMethod,
        Timestamp: order.timestamp,
        TotalAmount: typeof order.totalamount === "number" 
          ? order.totalamount.toFixed(2) 
          : "0.00",
        DeliveryAddress: order.deliveryDetails.address,
        DeliveryEmail: order.deliveryDetails.email,
        DeliveryPhone: order.deliveryDetails.phone,
        DeliveryName: order.deliveryDetails.name,
        Items: order.items.map(item => `${item.itemName} (Qty: ${item.quantity})`).join(", ")
      };
    });
  
    console.log("Final Data for Excel:", data); // Log data before exporting
  
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CartOrders");
    XLSX.writeFile(workbook, "CartOrders.xlsx");
  };
  const exportReservationsToExcel = () => {
    const data = reservations.map(reservation => ({
      ReservationID: reservation.id,
      Name: reservation.name,
      Email: reservation.email,
      Phone: reservation.phone,
      Date: reservation.date,
      Time: reservation.time,
      Guests: reservation.guests
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reservations");
    XLSX.writeFile(workbook, "Reservations.xlsx");
  };

  const sendEmailNotification = (user) => {
    emailjs.send(
      "service_dqiptdg", 
      "template_t6fir8m", 
      {
        to_name: user.username,
        to_email: user.email,
      },
      "5vkTpXkJkyC6RAsjo"
    )
    .then((response) => {
      console.log("Email sent successfully:", response);
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.username}'s account?`)) {
      try {
        await deleteDoc(doc(db, "users", user.id));
        setUsers(users.filter((u) => u.id !== user.id));
        sendEmailNotification(user);
        alert("User deleted successfully, and email notification sent!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  return (
    <>
      <Admin_nav />
      <div className="admin-dashboard-container">
        <div className="users-section">
          <h3>Registered Users</h3>
          <div className="users-grid">
            {users.map((user) => (
              <div key={user.id} className="user-card">
                <FontAwesomeIcon icon={faUser} className="user-icon" />
                <div className="user-info">
                  <h4>{user.username}</h4>
                  <p>Email: {user.email}</p>
                  <p>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
                  <button className="delete-user-btn" onClick={() => handleDeleteUser(user)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete User
                  </button>
                </div>
              </div>
            ))}
            {users.length === 0 && <p>No registered users found.</p>}
          </div>
        </div>

        <div className="export-buttons">
          <button className="export-btn" style={{ marginBottom: "5px" }} onClick={exportCartOrdersToExcel}>
            <FontAwesomeIcon icon={faFileExcel} /> Generate Orders Report
          </button>
          <button className="export-btn" onClick={exportReservationsToExcel}>
            <FontAwesomeIcon icon={faFileExcel} /> Generate Reservation Report
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
