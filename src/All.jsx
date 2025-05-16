import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './All.css';

const All = () => {
  const vegProducts = useSelector(state => state.products.Veg);
  const nonVegProducts = useSelector(state => state.products.NonVeg);
  const chocolateProducts = useSelector(state => state.products.Chocolate);

  // Combine all products into one array
  const allProducts = [
    ...vegProducts.map(product => ({ ...product, category: 'Veg' })),
    ...nonVegProducts.map(product => ({ ...product, category: 'NonVeg' })),
    ...chocolateProducts.map(product => ({ ...product, category: 'Chocolate' })),
  ];

  // Pagination state
  const itemsPerPage = 4; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index of the last and first items on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Get the current items to display on the page
  const currentItems = allProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Map through current items to display
  const productItems = currentItems.map((product, index) => (
    <div key={index} className="product-card">
      <img
        src={product.image || '/image/fallback.jpg'}
        alt={product.name}
        className="product-image"
      />
      <h3>{product.name}</h3>
      <p>Price: ₹{product.price}</p>
      <p>Category: {product.category}</p>
      <button>Add to Cart</button>
    </div>
  ));

  // Calculate the total number of pages
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);

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
    <div className="all-products-container">
      <h1>All Products</h1>
      <div className="product-list">
        {productItems}
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

export default All;
