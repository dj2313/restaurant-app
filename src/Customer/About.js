import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './../firebase/config';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import './About.css';

function AboutUs() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({}); // Validation errors state
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

    const faqs = [
    { question: 'What are the working hours?', answer: 'We are available from 9:00 AM to 10:00 PM from Monday to Sunday.' },
    { question: 'Do you offer vegetarian options?', answer: 'Yes, we have a variety of vegetarian and vegan options on our menu.' },
    { question: 'Can I make a reservation?', answer: 'Absolutely! You can make a reservation using our online booking system.' },
    { question: 'Do you have parking availability?', answer: 'Yes, we offer free parking for all our customers.' },
    { question: 'Is your restaurant family-friendly?', answer: 'Yes, we have a kids menu and a play area for children.' },
  ];
  
  const testimonials = [
    { name: 'Ricken Parmar', rating: 5, description: 'The food was absolutely amazing! Highly recommend the dal makhani.' },
    { name: 'Pranav Gor', rating: 4, description: 'Great ambiance and the service was top-notch.' },
    { name: 'Sunil Rathod', rating: 5, description: 'Best paneer tikka I have ever had. A must-visit for food lovers.' },
    { name: 'Sanjay Macwan', rating: 4, description: 'Delicious Samosas and a cozy atmosphere.' },
    { name: 'Amit Rathod', rating: 5, description: 'Excellent menu variety and superb quality.' },
  ];
  

  // Validation Function
  const validateForm = () => {
    let errors = {};

    if (!formData.name.trim() || formData.name.length < 3) {
      errors.name = "Name must be at least 3 characters long.";
    }

    if (!formData.email.trim() || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be 10 digits long.";
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      errors.message = "Message must be at least 10 characters long.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix validation errors.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first!");
      navigate("/login");
      return;
    }

    try {
      const feedbackRef = collection(db, 'feedback');
      await addDoc(feedbackRef, formData);

      sendThankYouEmail(formData);
      toast.success('Feedback submitted successfully!');

      setFormData({ name: '', email: '', phone: '', message: '' }); // Reset form
      setErrors({}); // Clear errors
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    }
  };

  const sendThankYouEmail = (data) => {
    const templateParams = { to_name: data.name, to_email: data.email };

    emailjs
      .send('service_dqiptdg', 'template_q50le1j', templateParams, '5vkTpXkJkyC6RAsjo')
      .then((response) => {
        console.log('Thank-you email sent!', response);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  return (
    <section className="about-us">
      <div className="about-us-container">
        <h2>ABOUT US</h2>
        <p>
          Welcome to <strong>Dine Delight</strong>, where we serve delicious, freshly prepared meals
          with love and passion. Our mission is to create an unforgettable dining experience for our
          guests by offering exceptional food, outstanding service, and a warm, inviting atmosphere.
          We believe that every meal should be a celebration of flavors, community, and joy.
        </p>
        <h2>Our Story</h2>
        <p>
          Established in 2005, our story began with a simple yet profound vision: to bring people
          together through the joy of exceptional food and warm hospitality. From our humble
          beginnings as a small family-run eatery, we’ve grown into a cherished destination for food
          lovers seeking a perfect blend of tradition and innovation.
        </p>
        <h2>Our Philosophy</h2>
        <p>
          At Dine Delight, we believe in using only the finest ingredients, sourced locally and
          sustainably whenever possible. Every dish is crafted with care and attention to detail to
          ensure it exceeds your expectations. We are committed to fostering a sense of community
          and creating memories that last a lifetime.
        </p>
        <h2>Join Us</h2>
        <p>
          Whether you're celebrating a special occasion, enjoying a casual meal, or exploring new
          flavors, Dine Delight is here to make your experience truly special. We look forward to
          welcoming you to our table.
        </p>
      </div>

      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-container">
         {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <h3>{testimonial.name}</h3>
              <div className="rating">{'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}</div>
              <p>{testimonial.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`} onClick={() => toggleFAQ(index)}>
              <div className="faq-question">{faq.question}</div>
              {activeIndex === index && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="feedback-form-container">
        <h2>Customer Feedback</h2>
        <form onSubmit={handleSubmit} className="feedback-form">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          {errors.name && <p style={{ color: 'red', fontSize: '14px' }}className="error">{errors.name}</p>}

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          {errors.email && <p style={{ color: 'red', fontSize: '14px' }}className="error">{errors.email}</p>}

          <label htmlFor="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          {errors.phone && <p style={{ color: 'red', fontSize: '14px' }}className="error">{errors.phone}</p>}

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} required></textarea>
          {errors.message && <p style={{ color: 'red', fontSize: '14px' }}className="error">{errors.message}</p>}

          <button type="submit">Submit</button>
        </form>
      </section>

      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
}

export default AboutUs;
