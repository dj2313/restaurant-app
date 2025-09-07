import React, { useState } from "react";
import "./service.css";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";

const Service = () => {
  const [reservationData, setReservationData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "",
    date: "",
    time: "",
    message: ""
  });
  const navigate = useNavigate();
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleButtonClick = () => {
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first!");
      navigate("/login");
    } else {
      navigate("/service");
    }
  };

  
  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    if(token)
    {
    if (parseInt(reservationData.guests) >= 20) {
      alert("Insufficient space! Maximum 20 guests allowed per table.");
      return;
    }
    try {
      const reservationsRef = collection(db, "reservations");
      await addDoc(reservationsRef, reservationData);
      
      // Send confirmation email using EmailJS
      
      emailjs.send(
        'service_0lh9bls', 
        'template_sony4up', 
        {
          name: reservationData.name,
          email: reservationData.email,
          phone: reservationData.phone,
          guests: reservationData.guests,
          date: reservationData.date,
          time: reservationData.time,
          message: reservationData.message
        },
        'vgazO40EM-lnxUqH3'
      ).then((result) => {
        
        console.log("Email sent:", result.text);
        alert("Reservation submitted and confirmation email sent!");
        
      }).catch((error) => {
        console.error("Email error:", error.text);
        alert("Reservation submitted, but failed to send confirmation email.");
      });
      
      
      setReservationData({
        name: "",
        email: "",
        phone: "",
        guests: "",
        date: "",
        time: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting reservation:", error);
      alert("Failed to submit reservation. Please try again.");
    }

  }
  };

  

  const handleAvailabilityCheck = async (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    if(token){
    try {
      const reservationsRef = collection(db, "reservations");
      const q = query(
        reservationsRef,
        where("date", "==", reservationData.date),
        where("time", "==", reservationData.time)
      );
      const snapshot = await getDocs(q);
      
      let totalGuests = 0;
      snapshot.forEach((doc) => {
        totalGuests += parseInt(doc.data().guests);
      });

      if (totalGuests >= 20) {
        setAvailabilityMessage("No space available for the selected date and time.");
        alert("No space available for the selected date and time.");
      } else {
        setAvailabilityMessage("Space available! You can make a reservation.");
        alert("Space available! You can make a reservation.");
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      alert("Failed to check availability. Please try again.");
    }
  }
  };

  return (
    <div className="services-container">
      <div className="reservation-section">
        <div className="info">
          <h3>CONTACT US</h3>
          <h2>Here You Can Make A Reservation<br />Or Just Walk In To Our Restaurant</h2>
          <div className="contact-details">
            <div className="contact-card">
              <span className="icon">📞</span>
              <h4>Phone Numbers</h4>
              <p>+91 88668 21263</p>
            </div>
            <div className="contact-card">
              <span className="icon">📧</span>
              <h4>Emails</h4>
              <p>dinedelight39@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="reservation-form">
          <h3>Table Reservation</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name*"
              value={reservationData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email Address"
              value={reservationData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number*"
              value={reservationData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="guests"
              placeholder="Number Of Guests"
              value={reservationData.guests}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="date"
              value={reservationData.date}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="time"
              value={reservationData.time}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Message"
              value={reservationData.message}
              onChange={handleChange}
            ></textarea>
            <button type="submit" onClick={handleButtonClick}>Make A Reservation</button>
          </form>
        </div>
      </div>

      <div className="availability-section">
        <h3>Check Availability</h3>
        <p>Enter details to check available slots.</p>
        <form  onSubmit={ handleAvailabilityCheck }>
          <input
            type="date"
            name="date"
            value={reservationData.date}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="time"
            value={reservationData.time}
            onChange={handleChange}
            required
          />
          <button type="submit" onClick={handleButtonClick}>Check Availability</button>
          <button type="submit" onClick={() => navigate("/cancel_reservation")}>
      Cancel Reservation
    </button>
        </form>
        {availabilityMessage && <p>{availabilityMessage}</p>}
      </div>
    </div>
  );
};

export default Service;

// Be sure to replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', and 'YOUR_PUBLIC_KEY' with your EmailJS credentials!
// Let me know if you’d like me to help you set up the template or add a custom email design! 🚀