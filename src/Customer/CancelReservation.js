import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./CancelReservation.css"; // Import external CSS

const CancelReservation = () => {
  const storedEmail = localStorage.getItem("token");
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
  const handleButtonClick = () => {
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first!");
      navigate("/login");
    } else {
      navigate("/cancel_reservation");
    }
  };
  // Fetch reservations from Firestore
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reservations"));
        const userReservations = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((reservation) => reservation.email === storedEmail);

        setReservations(userReservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [storedEmail]);

  // Function to cancel reservation
  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await deleteDoc(doc(db, "reservations", id));
        setReservations(reservations.filter((reservation) => reservation.id !== id));
        toast.success("Reservation canceled successfully!", { position: "top-right" });
      } catch (error) {
        console.error("Error canceling reservation:", error);
        toast.error("Failed to cancel reservation. Please try again.", { position: "top-right" });
      }
    }
  };

  return (
    <div className="cancel-container">
      <h2 className="cancel-heading">Your Reservations</h2>
      <ToastContainer />
      <div className="reservation-wrapper">
        {reservations.length === 0 ? (
          <p className="no-reservations">No reservations found.</p>
        ) : (
          <ul className="reservation-list">
            {reservations.map((reservation) => (
              <li key={reservation.id} className="reservation-item">
                <p><strong>Date:</strong> {reservation.date}</p>
                <p><strong>Time:</strong> {reservation.time}</p>
                <p><strong>Guests:</strong> {reservation.guests}</p>
                <button className="cancelbutton"  onClick={() => { handleCancel(reservation.id); handleButtonClick(); }}>
                  Cancel Reservation
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CancelReservation;
