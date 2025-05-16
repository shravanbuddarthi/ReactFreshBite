import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Chocolate.css';
import { AddToCart } from './Store';
import { toast, ToastContainer } from 'react-toastify';

const Chocolate = () => {
  const chocolateProducts = useSelector(state => state.products.Chocolate);
  const dispatch = useDispatch();

  // Pagination state
  const itemsPerPage = 4; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index of the last and first items on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Get the current items to display on the page
  const currentItems = chocolateProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Map through current items to display
  const chocolateListItems = currentItems.map((product, index) => (
    <div key={index} className="product-card">
      <img
        src={product.image || '/image/fallback.jpg'}
        alt={product.name}
        className="chocolate-image"
      />
      <h3>{product.name}</h3>
      <p>Price: ₹{product.price}</p>
      <button onClick={() =>{ dispatch(AddToCart(product));toast.info(`${product.name} is added in the cart`);}}>Add to Cart</button>
    </div>
  ));

  // Calculate the total number of pages
  const totalPages = Math.ceil(chocolateProducts.length / itemsPerPage);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handlers for pagination buttons
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="chocolate-container">
      <h1>These Are Chocolate Products</h1>
      <ToastContainer position='top-center' autoClose={1000}/>
      <div className="product-list">
        {chocolateListItems}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        
        {/* Individual page number buttons */}
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}

        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Chocolate;
