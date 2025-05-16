import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Veg from './Veg';
import NonVeg from './NonVeg';
import Home from './Home';
import Chocolate from './Chocolate';
import ContactUs from './ContactUs';
import Cart from './Cart';
import Login from './Login';
import All from './All';

import './Menu.css';
import './Login.css';
import Orders from './Orders';
import './App.css'

function App() {
  const cartItems = useSelector(state => state.Cart);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
  <div className="logo-title">
    <img src="/logo.webp" alt="Zepto Logo" className="logo" />
    <h1 className="title">FreshBite</h1>
  </div>

  <nav className="nav-bar">
    <NavLink to="/All">📋 All</NavLink>
    <NavLink to="/Home">🏠 Home</NavLink>
    <NavLink to="/Veg">🥦 Veg</NavLink>
    <NavLink to="/NonVeg">🍗 NonVeg</NavLink>
    <NavLink to="/Chocolate">🍫 Chocolate</NavLink>
    <NavLink to="/ContactUs">📞 Contact Us</NavLink>
    <NavLink to="/Cart">🛒 Cart ({totalCartCount})</NavLink>
    <NavLink to="/Login">🔐 Login</NavLink>
    <NavLink to="/Orders">📦 Orders</NavLink>
  </nav>
</header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/All" element={<All />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Veg" element={<Veg />} />
            <Route path="/NonVeg" element={<NonVeg />} />
            <Route path="/Chocolate" element={<Chocolate />} />
            <Route path="/ContactUs" element={<ContactUs />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Orders" element={<Orders />} />
            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </main>

        <footer>
          <p>© 2025 Foodie App. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
