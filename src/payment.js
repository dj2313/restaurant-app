import React, { useState, useEffect } from 'react'; 
import { db } from './firebase/config';
import { collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import './payment.css';
import emailjs from 'emailjs-com';

const Payment = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [paymentOption, setPaymentOption] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ cardName: '', cardNumber: '', expiryDate: '', cvv: '' });
  const [loading, setLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      const cartRef = collection(db, 'cart');
      const querySnapshot = await getDocs(cartRef);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCartItems(items);
    };

    fetchCartItems();
  }, []);

  const calculateGrandTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const validateForm = () => {
    return formData.name && formData.email && formData.phone && formData.address;
  };
  const validateCard = () => {
    const { cardName, cardNumber, expiryDate, cvv } = cardDetails;
  
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      alert('Please fill all card details.');
      return false;
    }
  
    if (!/^\d{16}$/.test(cardNumber)) {
      alert('Card number must be 16 digits.');
      return false;
    }
  
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      alert('Expiry date must be in MM/YY format.');
      return false;
    }
  
    if (!/^\d{3}$/.test(cvv)) {
      alert('CVV must be 3 digits.');
      return false;
    }
  
    return true;
  };
  const validateDeliveryDetails = () => {
    const { name, email, phone, address } = formData;
  
    // Name validation: Only letters and spaces, at least 3 characters
    if (!/^[a-zA-Z\s]{3,}$/.test(name)) {
      alert("Please enter a valid name (only letters, at least 3 characters).");
      return false;
    }
  
    // Email validation: Must be a valid email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }
  
    // Phone validation: Must be exactly 10 digits
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return false;
    }
  
    // Address validation: At least 10 characters
    if (address.length < 10) {
      alert("Address must be at least 10 characters long.");
      return false;
    }
  
    return true;
  };
  const validateUPI = () => {
    if (!upiId) {
      alert("Please enter a valid UPI ID.");
      return false;
    }
  
    if (!/^\w+@\w+$/.test(upiId)) {
      alert("Invalid UPI ID format. Example: username@upi");
      return false;
    }
  
    return true;
  };
  const handleConfirmDetails = () => {
    if (validateDeliveryDetails()) {
      setIsConfirmed(true);
      alert("Delivery details confirmed! You can proceed to payment.");
    }
  };

  const sendPaymentEmail = (formData, cartItems, paymentOption, totalAmount) => {
    const itemSummary = cartItems
      .map(item => `• ${item.itemName} (x${item.quantity}) - ₹${item.price * item.quantity}`)
      .join('\n');

    emailjs.send(
      "service_owkf30m",                // Your EmailJS service ID
      "template_3atlycq",               // Your EmailJS template ID
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        items: itemSummary,
        totalAmount: totalAmount,
        paymentMethod: paymentOption === 'upi' ? `UPI (${upiId})` : paymentOption,
      },
      "ugBi0_c-kBY_rSsbw"                 // Your EmailJS public key
    )
    .then((response) => {
      console.log("Email sent successfully:", response);
      alert("Payment successful! Confirmation email sent.");
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      alert("Payment successful, but failed to send confirmation email.");
    });
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Please add items before proceeding.");
      return;
    }
  
    if (!paymentOption) {
      alert('Please select a payment option.');
      return;
    }
  
    if (paymentOption === 'upi' && !validateUPI()) return;
    if (paymentOption === 'card' && !validateCard()) return;
  
    setLoading(true);
  
    try {
      await addDoc(collection(db, 'cartorders'), {
        items: cartItems,
        deliveryDetails: formData,
        paymentMethod: paymentOption === 'upi' ? `UPI (${upiId})` : paymentOption,
        totalAmount: calculateGrandTotal(),
        timestamp: new Date(),
      });
  
      sendPaymentEmail(formData, cartItems, paymentOption, calculateGrandTotal());
  
      const cartRef = collection(db, 'cart');
      const querySnapshot = await getDocs(cartRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
  
      setCartItems([]);
      setLoading(false);
      alert('Payment Successful! Order Confirmed');
      document.getElementById('paymentModal').close();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };
  

  return (
    <div className="payment-container">
      <div className="left-section">
        <h2>Order Summary</h2>
        <div className="summary-section">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <p key={index}>{item.itemName} (₹{item.price}) X {item.quantity} = ₹{item.price * item.quantity}</p>
            ))
          ) : (
            <p>Your cart is empty</p>
          )}
          <hr />
          <h3>Grand Total: ₹{calculateGrandTotal()}</h3>
        </div>
      </div>

      <div className="right-section">
        <h2>Delivery Details</h2>
        <form className="delivery-form">
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required />
          <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
        </form>
        {/* <button className="confirm-btn" onClick={handleConfirmDetails} disabled={isConfirmed}>Confirm</button> */}
        <button className="confirm-btn" onClick={handleConfirmDetails} disabled={isConfirmed || cartItems.length === 0}>Confirm</button>
      </div>

      <div className="bottom-section">
        <button
          className="make-payment-btn"
          onClick={() => document.getElementById('paymentModal').showModal()}
          disabled={!isConfirmed}
        >
          Make Payment
        </button>

        <dialog id="paymentModal">
          <h3>Select Payment Method</h3>
          <div className="payment-options">
            <button style={{ color: 'black' }} onClick={() => setPaymentOption('upi')} className={paymentOption === 'upi' ? 'active' : ''}>UPI</button>
            <button style={{ color: 'black' }} onClick={() => setPaymentOption('card')} className={paymentOption === 'card' ? 'active' : ''}>Credit/Debit/ATM Card</button>
            <button style={{ color: 'black' }} onClick={() => setPaymentOption('cod')} className={paymentOption === 'cod' ? 'active' : ''}>Cash on Delivery</button>
          </div>

          <div className="payment-form">
            {paymentOption === 'upi' && (
              <>
                <h4>Pay via UPI</h4>
                <input type="text" placeholder="Enter UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
              </>
            )}

            {paymentOption === 'card' && (
              <>
                <h4>Enter Card Details</h4>
                <input type="text" name="cardName" placeholder="Cardholder Name" onChange={handleCardChange} />
                <input type="text" name="cardNumber" placeholder="Card Number" maxLength="16" onChange={handleCardChange} />
                <input type="text" name="expiryDate" placeholder="MM/YY" maxLength="5" onChange={handleCardChange} />
                <input type="text" name="cvv" placeholder="CVV" maxLength="3" onChange={handleCardChange} />
              </>
            )}

            {paymentOption === 'cod' && <p>Cash on Delivery selected. You can pay when you receive your order.</p>}
          </div>

          <button className="pay-now-btn" onClick={handlePayment} disabled={loading || !paymentOption}>
            {loading ? 'Processing...' : `Pay ₹${calculateGrandTotal()} Now`}
          </button>
          <button onClick={() => document.getElementById('paymentModal').close()}>Close</button>
        </dialog>
      </div>
    </div>
  );
};

export default Payment;
