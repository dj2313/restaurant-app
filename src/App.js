import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Footer from './footer';
import Home from './Customer/home';
import Features from './Customer/features';
import AboutUs from './Customer/About';
import ServicesPage from './Customer/service';
import Menu from './Customer/menu';
import Login from './login';
import Register from './register'; 
import Navbar from './nav';
import AdminRegister from "./AdminRegister";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminMenu from './AdminMenu';
import Admin_nav from './Admin_nav';
import OnlineOrder from './Customer/onlineorder';
import Footer1 from './footer1';
import AdminOrders from './AdminOrders';
import AdminReservations from './AdminReservations';
import AdminChefs from './AdminChefs';
import AdminUpdate from './AdminUpdate';
import AdminReview from './AdminReview';
import AdminChefUpdate from './AdminChefUpdate';
import Cart from './cart';
import Payment from './payment';
import LogoutButton from './logout';
import PaymentGateway from './PaymentGateway';
import Profile from './Profile';
import OrderHistory from './OrderHistory';
import CancelReservation from './Customer/CancelReservation';
// Protected Route Component for Customers
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const AppLayout = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || 
                       location.pathname === '/register' || 
                       location.pathname === '/admin_register' || 
                       location.pathname === '/admin_login';

    if (isAuthPage) {
      return (
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin_login" element={<AdminLogin />} />
          <Route path="/admin_register" element={<AdminRegister />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      );
    }

    return (
      <>
        <Navbar />
        <Routes>
          {/* Default route redirects to home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* Public Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/service" element={<ServicesPage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<AboutUs />} />

          {/* Protected Customer Routes */}
          <Route path="/onlineorder" element={<ProtectedRoute><OnlineOrder /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/logout" element={<LogoutButton />} />
          <Route path="/payment_gateway" element={<ProtectedRoute><PaymentGateway /></ProtectedRoute>} />
          <Route path="/order_history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/cancel_reservation" element={<ProtectedRoute><CancelReservation /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin_dashboard" element={<AdminDashboard />} />
          <Route path="/admin_menu" element={<AdminMenu />} />
          <Route path="/admin_orders" element={<AdminOrders />} />
          <Route path="/admin_reservations" element={<AdminReservations />} />
          <Route path="/admin_chefs" element={<AdminChefs />} />
          <Route path="/admin_update" element={<AdminUpdate />} />
          <Route path="/admin_review" element={<AdminReview />} />
          <Route path="/admin_chefUpdate" element={<AdminChefUpdate />} />
        </Routes>
        <Footer1 />
      </>
    );
  };

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
