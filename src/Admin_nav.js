import React from 'react';
import './Admin_nav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faTachometerAlt, 
  faUtensils,
  faShoppingBag,
  faUserTie,
  faBook,
  
} from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";

const Admin_nav = () => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate('/admin_dashboard');
  };

  const handleUserClick = () => {
    navigate('/login');
  };

  return (
    <div className="ad-container">
      <nav className="admin_nav">
        <h1 className="logo">Dine Delight<span className="dot">.</span></h1>
        <ul className="nav-links">
          {/* <li>
            <Link to='/admin_dashboard' className="navbar-link">
              <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
              <span>Dashboard</span>
            </Link>
          </li> */}
          <li>
            <Link to='/admin_menu' className="navbar-link">
              <FontAwesomeIcon icon={faUtensils} className="nav-icon" />
              <span>Menu</span>
            </Link>
          </li>
          <li>
            <Link to='/admin_orders' className="navbar-link">
              <FontAwesomeIcon icon={faShoppingBag} className="nav-icon" />
              <span>Orders</span>
            </Link>
          </li>
          <li>
            <Link to='/admin_reservations' className="navbar-link">
            <FontAwesomeIcon icon={faBook} className="nav-icon" />
              <span>Reservations</span>
            </Link>
          </li>
          <li>
            <Link to='/admin_chefs' className="navbar-link">
              <FontAwesomeIcon icon={faUserTie} className="nav-icon" />
              <span>Chefs</span>
            </Link>
          </li>
          <li>
            <Link to='/admin_review' className="navbar-link">
              <FontAwesomeIcon icon={faThumbsUp} className="nav-icon" />
              <span>Reviews</span>
            </Link>
          </li>
        </ul>
        
        <div className="nav-buttons">
          <button 
            className='dashboard-btn'
            onClick={handleDashboardClick}
          >
            <FontAwesomeIcon icon={faTachometerAlt} />
            <span>Admin Dashboard</span>
          </button>
          <button 
            className='user-btn'
            onClick={handleUserClick}
          >
            <FontAwesomeIcon icon={faUser} />
            <span>User Login</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Admin_nav;
