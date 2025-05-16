import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IncCart, DecCart, RemoveFromCart, ClearCart, AddOrder } from './Store';
import { useNavigate } from 'react-router-dom';
import ReactQRCode from 'react-qr-code';
import './Cart.css';
import emailjs from 'emailjs-com';
import { Toast } from 'bootstrap';
import { toast, ToastContainer } from 'react-toastify';

function Cart() {
  const cartObjects = useSelector((state) => state.Cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailRef = useRef();
  const [customerEmail, setCustomerEmail] = useState('');

  const [manualDiscountPercentage, setManualDiscountPercentage] = useState(0);
  const [couponDiscountPercentage, setCouponDiscountPercentage] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const calculateTotalAmount = () =>
    cartObjects.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateDiscount = (total, percentage) => total * (percentage / 100);

  const handleCouponApply = () => {
    const validCoupons = {
      'DISCOUNT10': 10,
      'DISCOUNT20': 20,
      'DISCOUNT30': 30,
      'FREESHIP': 0,
      'SUMMER50': 50,
    };

    if (!couponCode) {
      setErrorMessage('Please enter a coupon code');
    } else if (validCoupons[couponCode.toUpperCase()]) {
      setCouponDiscountPercentage(validCoupons[couponCode.toUpperCase()]);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid Coupon Code');
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPaymentConfirmed(false);
  };

  const handleCheckout = () => {
    if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      alert("Please enter a valid email address before confirming.");
      return;
    }

    const totalAmount = calculateTotalAmount();
    const manualDiscount = calculateDiscount(totalAmount, manualDiscountPercentage);
    const couponDiscount = calculateDiscount(totalAmount, couponDiscountPercentage);
    const finalAmount = totalAmount - manualDiscount - couponDiscount;
    const tax = finalAmount * 0.18;
    const shippingCost = 50;

    const purchaseDetails = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: [...cartObjects],
      finalPrice: finalAmount,
      paymentMethod: paymentMethod || 'Not Selected',
    };

    const templateParams = {
      order_id: purchaseDetails.id,
      orders: cartObjects.map(item => ({
        name: item.name,
        price: (item.price * item.quantity).toFixed(2),
        units: item.quantity
      })),
      cost: {
        shipping: shippingCost,
        tax: tax.toFixed(2),
        total: (finalAmount+shippingCost+tax).toFixed(2)
      },
      email: customerEmail
    };

    emailjs.send('service_pic9nhn', 'template_67i2qvg', templateParams, 'eYO06u6OsOUTbSXzr')
      .then(() => {
        alert('Confirmation email sent!');
      })
      .catch((error) => {
        alert('Failed to send email. Please try again.');
        console.error('Email sending failed:', error);
      });

    dispatch(AddOrder(purchaseDetails));
    setOrderCompleted(true);

    setTimeout(() => {
      dispatch(ClearCart());
      navigate('/orders');
    }, 5000);
  };

  const confirmPayment = () => handleCheckout();

  const totalAmount = calculateTotalAmount();
  const manualDiscount = calculateDiscount(totalAmount, manualDiscountPercentage);
  const couponDiscount = calculateDiscount(totalAmount, couponDiscountPercentage);
  const finalAmount = totalAmount - manualDiscount - couponDiscount;

  const cartListItems = cartObjects.map((item, index) => (
    <li key={index} className="cart-item">
      <img src={item.image || '/image/fallback.jpg'} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <h3>{item.name}</h3>
        <p>Price: ₹{item.price}</p>
        <p>Qty: {item.quantity}</p>
        <strong>Item Total: ₹{item.price * item.quantity}</strong>
      </div>
      <div className="button-group">
        <button onClick={() => {dispatch(IncCart(item));toast.info(`${item.name} quantity increase the count`);}}>+</button>
        <button onClick={() =>{ dispatch(DecCart(item));toast.info(`${item.name} quantity decrease the count`);}}>-</button>
        <button onClick={() =>{ dispatch(RemoveFromCart(item));toast.info(`${item.name} remove from the cart`);}}>Remove</button>
      </div>
    </li>
  ));

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <ToastContainer position='top-center' autoClose={1000}/>
      {orderCompleted ? (
        <div className="order-completed-message">
          <h3>Your order has been successfully completed!</h3>
          <p>Redirecting to your Orders page...</p>
        </div>
      ) : cartObjects.length > 0 ? (
        <>
          <ul className="cart-list">{cartListItems}</ul>

          <div className="coupon-section">
            {couponDiscountPercentage > 0 && (
              <div>
                <h4>Applied Coupon: {couponCode.toUpperCase()}</h4>
                <p>Coupon Discount: {couponDiscountPercentage}%</p>
                <button onClick={() => {
                  setCouponDiscountPercentage(0);
                  setCouponCode('');
                }}>Remove Coupon</button>
              </div>
            )}

            <h3>Have a Coupon?</h3>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter Coupon Code"
            />
            <button onClick={handleCouponApply}>Apply Coupon</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </div>

          <div className="discount-buttons">
            <p>Apply Discount:</p>
            <button onClick={() => setManualDiscountPercentage(10)}>10% Off</button>
            <button onClick={() => setManualDiscountPercentage(20)}>20% Off</button>
            <button onClick={() => setManualDiscountPercentage(30)}>30% Off</button>
            {manualDiscountPercentage > 0 && (
              <button onClick={() => setManualDiscountPercentage(0)}>Remove</button>
            )}
          </div>

          <div className="cart-summary">
            <h3>Total Amount: ₹{totalAmount.toFixed(2)}</h3>
            <h4>Manual Discount ({manualDiscountPercentage}%): ₹{manualDiscount.toFixed(2)}</h4>
            <h4>Coupon Discount ({couponDiscountPercentage}%): ₹{couponDiscount.toFixed(2)}</h4>
            <h3>Final Amount: ₹{finalAmount.toFixed(2)}</h3>
          </div>

          <div className="button-group">
            <h3>Choose Payment Method</h3>
            <button onClick={() => handlePaymentMethodChange('UPI')}>UPI Payment</button>
            <button onClick={() => handlePaymentMethodChange('Card')}>Credit/Debit Card</button>
            <button onClick={() => handlePaymentMethodChange('Wallet')}>Wallet</button>
          </div>

          <div className='mb-3'>
            <label className='form-label'>Enter your email</label>
            <input
              type='email'
              className='form-control'
              ref={emailRef}
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder='example@email.com'
            />
          </div>

          {paymentMethod === 'UPI' && (
            <div>
              <h3>Scan to Pay via UPI</h3>
              <ReactQRCode value={`upi://pay?pa=9515701651@ybl&pn=CartCraze&am=${finalAmount.toFixed(2)}&cu=INR`} />
              <p>Scan this QR with any UPI app</p>
              <label>
                <input
                  type="checkbox"
                  checked={paymentConfirmed}
                  onChange={(e) => setPaymentConfirmed(e.target.checked)}
                /> I have completed the payment
              </label>
              <button onClick={confirmPayment} disabled={!paymentConfirmed}>
                Complete Order
              </button>
            </div>
          )}

          {paymentMethod === 'Card' && (
            <div>
              <h3>Enter Card Details</h3>
              <input type="text" placeholder="Card Number" maxLength="16" />
              <input type="text" placeholder="Cardholder Name" />
              <input type="text" placeholder="MM/YY" maxLength="5" />
              <input type="text" placeholder="CVV" maxLength="3" />
              <label>
                <input
                  type="checkbox"
                  checked={paymentConfirmed}
                  onChange={(e) => setPaymentConfirmed(e.target.checked)}
                /> I confirm payment was successful
              </label>
              <button onClick={confirmPayment} disabled={!paymentConfirmed}>
                Pay ₹{finalAmount.toFixed(2)}
              </button>
            </div>
          )}

          {paymentMethod === 'Wallet' && (
            <div>
              <h3>Wallet Payment</h3>
              <select>
                <option>-- Select Wallet --</option>
                <option>Paytm</option>
                <option>PhonePe</option>
                <option>Amazon Pay</option>
              </select>
              <input type="text" placeholder="Mobile Number" maxLength="10" />
              <label>
                <input
                  type="checkbox"
                  checked={paymentConfirmed}
                  onChange={(e) => setPaymentConfirmed(e.target.checked)}
                /> I confirm payment was successful
              </label>
              <button onClick={confirmPayment} disabled={!paymentConfirmed}>
                Pay ₹{finalAmount.toFixed(2)}
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
  
}

export default Cart;
