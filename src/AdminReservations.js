import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase/config";
import Admin_nav from './Admin_nav';
import emailjs from "emailjs-com";
import "./AdminReservations.css";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationsRef = collection(db, "reservations");
        const snapshot = await getDocs(reservationsRef);
        const reservationsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReservations(reservationsList.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const sendCancellationEmail = (reservation) => {
    const templateParams = {
      to_email: reservation.email,
      name: reservation.name,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      message: reservation.message,
    };

    emailjs.send(
      "service_0lh9bls",
      "template_juftyqq",
      templateParams,
      "vgazO40EM-lnxUqH3"
    )
    .then((response) => {
      console.log("Email sent successfully:", response);
      alert("Cancellation email sent to the customer.");
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      alert("Failed to send cancellation email.");
    });
  };

  const handleCancel = async (id) => {
    const reservationToCancel = reservations.find(res => res.id === id);

    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await deleteDoc(doc(db, "reservations", id));
        setReservations(prevReservations => prevReservations.filter(reservation => reservation.id !== id));
        alert("Reservation canceled successfully.");
        sendCancellationEmail(reservationToCancel);
      } catch (error) {
        console.error("Error canceling reservation:", error);
        alert("Failed to cancel reservation.");
      }
    }
  };

  if (loading) {
    return (
      <>
        <Admin_nav />
        <div className="admin-reservations-container">
          <h2>Loading reservations...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Admin_nav />
      <div className="admin-reservations-container">
        <h2>Customer Reservations</h2>
        <div className="reservations-grid">
          {reservations.length === 0 ? (
            <p>No reservations found.</p>
          ) : (
            reservations.map(reservation => (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-header">
                  <h3>Reservation #{reservation.id.slice(-6)}</h3>
                  <span className="reservation-date">
                    {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                  </span>
                </div>
                <div className="reservation-details">
                  <p><strong>Name:</strong> {reservation.name}</p>
                  <p><strong>Email:</strong> {reservation.email}</p>
                  <p><strong>Phone:</strong> {reservation.phone}</p>
                  <p><strong>Guests:</strong> {reservation.guests}</p>
                  <p><strong>Message:</strong> {reservation.message}</p>
                </div>
                <button 
                  className="cancel-button" 
                  onClick={() => handleCancel(reservation.id)}
                >
                  Cancel
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AdminReservations;
