import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Orders.css';

function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.Orders); // Assuming orders are stored in the Redux state

  // Fetch orders if needed (this would be part of a Redux action)
  useEffect(() => {
    // dispatch(fetchOrders()); // Uncomment if you have an action to fetch orders
  }, [dispatch]);

  // State to manage individual order visibility
  const [visibleOrders, setVisibleOrders] = useState(
    orders.map(() => false) // Initialize each order to be hidden
  );

  // Function to toggle the visibility of a specific order's details
  const toggleOrderVisibility = (index) => {
    const updatedVisibility = [...visibleOrders];
    updatedVisibility[index] = !updatedVisibility[index];
    setVisibleOrders(updatedVisibility);
  };

  const renderOrders = orders.map((order, index) => (
    <div key={index} className="order-card">
      <h3>
        Order ID: #{index + 1} 
        <button
          onClick={() => toggleOrderVisibility(index)}
          style={{ marginLeft: '10px', padding: '5px 10px' }}
        >
          {visibleOrders[index] ? 'Hide Details' : 'Show Details'}
        </button>
      </h3>

      {/* Conditionally render the order details */}
      {visibleOrders[index] && (
        <>
          <p>Date: {order.date}</p>
          <div className="order-items">
            {order.items.map((item, itemIndex) => (
              <div key={itemIndex} className="order-item">
                <img
                  src={item.image || '/image/fallback.jpg'}
                  alt={item.name}
                  className="order-item-image"
                />
                <div className="order-item-details">
                  <p><strong>{item.name}</strong></p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: ₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="order-total">Total: ₹{order.finalPrice.toFixed(2)}</p>
        </>
      )}
    </div>
  ));

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        <div className="orders-list">{renderOrders}</div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default Orders;
