import React from "react";
import "./footer1.css";
import { 
  FaPhone, 
  FaClock, 
  FaArrowUp, 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter,
  FaWhatsapp
} from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

const Footer1 = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-item">
          <FaPhone className="footer-icon" />
          <h3>Contact</h3>
          <p>
            <strong>Phone: </strong>
            <a href="tel:+918866821263">+91 88668 21263</a>
          </p>
          <p>
            <strong>Email: </strong>
            <a href="mailto:dinedelight39@gmail.com">dinedelight39@gmail.com</a>
          </p>
        </div>

        <div className="footer-item">
          <FaClock className="footer-icon" />
          <h3>Opening Hours</h3>
          <p><strong>Mon-Sat: </strong> 11:00 AM - 23:00 PM</p>
          <p><strong>Sunday: </strong> Closed</p>
        </div>

        <div className="footer-item">
          <FontAwesomeIcon icon={faComment} className="footer-icon" />
          <h3>Follow Us</h3>
          <div className="social-icons">
            <div className="icons">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
              >
                <FaFacebookF className="social-icon" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <hr />

      <div className="footer-bottom">
        <p>© Copyright <strong>Dine Delight</strong> All Rights Reserved</p>
      </div>

      <a href="#" className="scroll-top" onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}>
        <FaArrowUp />
      </a>
    </footer>
  );
};

export default Footer1;
