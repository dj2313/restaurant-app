import React, { useState } from 'react';
import './features.css';
import menu from './../Images/menu.jpg';
import seam from './../Images/seamless.png';
import table from './../Images/table.jpg';
import review from './../Images/review.jpg';
import pay from './../Images/pay.jpg';

function Features() {
  const [modalContent, setModalContent] = useState(null);

  const features = [
    {
      title: "Seamless Online Ordering",
      shortDesc: "With just a few clicks, customers can browse, select, and purchase items or book services from the comfort of their homes.",
      longDesc: "Our platform provides a user-friendly interface that allows for smooth navigation and quick purchases. Whether you're ordering food, booking appointments, or shopping online, our system ensures a hassle-free experience with multiple payment options and real-time order tracking.",
      image: seam
    },
    {
      title: "Easy Table Reservations",
      shortDesc: "Reserve your table effortlessly with our intuitive booking system, ensuring a hassle-free dining experience.",
      longDesc: "Forget long waiting times! Our reservation system allows you to book your preferred table in advance, customize seating preferences, and receive instant confirmations—all with just a few taps on your device.",
      image: table
    },
    {
      title: "Customer Reviews & Ratings",
      shortDesc: "We value every piece of feedback as it inspires us to improve and innovate. Your voices guide us to deliver the best experiences.",
      longDesc: "User-generated reviews help build trust within our community. Our platform enables verified customers to share insights, rate their experiences, and interact with businesses, ensuring transparency and quality service.",
      image: review
    },
    {
      title: "Secure Payment Options",
      shortDesc: "Enjoy safe and seamless transactions with our robust, secure payment methods, prioritizing your trust and security.",
      longDesc: "We implement industry-standard encryption and multi-factor authentication to ensure that all transactions are secure. Whether you prefer credit cards, digital wallets, or direct bank transfers, our payment gateways keep your financial details protected.",
      image: pay
    }
  ];

  return (
    <section className="features-section">
      <div className="features-header">
        <h1>Key Features</h1>
        <p>Discover what makes our platform stand out. Experience innovation, simplicity, and excellence.</p>
      </div>

      {features.map((feature, index) => (
        <div className={`feature-card ${index % 2 !== 0 ? 'reverse' : ''}`} key={index}>
          <div className="feature-text">
            <h2>{feature.title}</h2>
            <p>{feature.shortDesc}</p>
            <button className="read-more-btn" onClick={() => setModalContent(feature)}>Read More</button>
          </div>
          <div className="feature-image">
            <img src={feature.image} alt={feature.title} />
          </div>
        </div>
      ))}

      {modalContent && (
        <div className="modal-overlay" onClick={() => setModalContent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modalContent.title}</h2>
            <p>{modalContent.longDesc}</p>
            <button className="close-btn" onClick={() => setModalContent(null)}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Features;
