import React, { useState } from 'react';
import './PaymentGateway.css';

const PaymentGateway = () => {
  const [paymentOption, setPaymentOption] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ cardName: '', cardNumber: '', expiryDate: '', cvv: '' });
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Payment Successful! Order Confirmed');
    }, 3000);
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  return (
    <div className="payment-gateway-container">
     
      <div className="order-summary">
        <p>Order Total: <strong>₹241</strong></p>
        <p className="secure-label">🔒 100% Secure</p>
      </div>

      <h3>Select Payment Method</h3>
      <div className="payment-options">
        <button onClick={() => setPaymentOption('upi')} className={paymentOption === 'upi' ? 'active' : ''}>UPI</button>
        <button onClick={() => setPaymentOption('card')} className={paymentOption === 'card' ? 'active' : ''}>Credit/Debit/ATM Card</button>
        <button onClick={() => setPaymentOption('cod')} className={paymentOption === 'cod' ? 'active' : ''}>Cash on Delivery</button>
        <button onClick={() => setPaymentOption('netbanking')} className={paymentOption === 'netbanking' ? 'active' : ''}>Net Banking</button>
        <button onClick={() => setPaymentOption('wallet')} className={paymentOption === 'wallet' ? 'active' : ''}>Wallets</button>
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

        {paymentOption === 'cod' && (
          <p>Cash on Delivery selected. You can pay when you receive your order.</p>
        )}

        {paymentOption === 'netbanking' && (
          <p>Select a bank and proceed to pay via net banking.</p>
        )}

        {paymentOption === 'wallet' && (
          <p>Choose your preferred wallet and proceed to pay.</p>
        )}
      </div>

      <button className="pay-now-btn" onClick={handlePayment} disabled={loading || !paymentOption}>
        {loading ? 'Processing...' : `Pay ₹241 Now`}
      </button>
    </div>
  );
};

export default PaymentGateway;

// Let me know if you’d like me to tweak anything or style this to match the UI perfectly! 🚀