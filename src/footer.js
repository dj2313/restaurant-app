import './footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section contact">
                    <h4>Contact Us</h4>
                    <p>A/13 Shreyas Society Anand</p>
                    <p><a href="mailto:rickenparmar@gmail.com">rickenparmar@gmail.com</a></p>
                    <p><a href="tel:+918866821263">+91 88668 21263</a></p>
                </div>

                <div className="footer-section quick-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/menu">Menu</Link></li>
                        <li><Link to="/service">Services</Link></li>
                        <li><Link to="/features">Features</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                    </ul>
                </div>

                <div className="footer-section social-media">
                    <h4>Follow Us</h4>
                    <div className="social-icons">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="instagram">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        {/* <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="linkedin">
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a> */}
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="facebook">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        {/* <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="twitter">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a> */}
                    </div>
                </div>

                <div className="footer-section newsletter">
                    <h4>Newsletter</h4>
                    <form>
                        <input type="email" placeholder="Enter your email" className="newsletter-input" />
                        <button type="submit" className="newsletter-button">Submit</button>
                    </form>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 Dine Delight. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
