import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Veg.css';
import { AddToCart } from './Store';
import { toast, ToastContainer } from 'react-toastify';

const Veg = () => {
  // Fetching vegProducts from the Redux store
  const vegProducts = useSelector(state => state.products?.Veg || []); // Fallback to empty array if Veg is undefined

  const dispatch = useDispatch();

  // Pagination state
  const itemsPerPage = 4; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index of the last and first items on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Get the current items to display on the page
  const currentItems = vegProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Map through current items to display
  const vegListItems = currentItems.map((product, index) => (
    <div key={index} className="product-card">
      <img
        src={product.image || '/image/fallback.jpg'}
        alt={product.name}
        className="veg-image"
      />
      <h3>{product.name}</h3>
      <p>Price: ₹{product.price}</p>
      <button className="add-to-cart-btn" onClick={() =>{ dispatch(AddToCart(product));toast.info(`${product.name} is added in the cart`);}}>
        Add to Cart
      </button>
    </div>
  ));

  // Calculate the total number of pages
  const totalPages = Math.ceil(vegProducts.length / itemsPerPage);

  // Function to generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handler to set the current page
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="veg-container">
      <h1>These Are Veg Products</h1>
      <ToastContainer position='top-center' autoClose={1000}/>
      <div className="product-list">
        {vegListItems}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>

        {/* Dynamically generate page number buttons */}
        {pageNumbers.map(number => (
          <button 
            key={number} 
            onClick={() => handlePageClick(number)} 
            className={currentPage === number ? 'active' : ''}>
            {number}
          </button>
        ))}

        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Veg;
