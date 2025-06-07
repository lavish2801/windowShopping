import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import { API } from '../config/api';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const shopId = localStorage.getItem('shopId');
      const response = await axios.get(API.getProducts(shopId));
      setProducts(response.data);
      // Initialize currentImageIndex for each product
      const initialImageIndices = {};
      response.data.forEach(product => {
        initialImageIndices[product._id] = 0;
      });
      setCurrentImageIndex(initialImageIndices);
    } catch (err) {
      setError('Error fetching products');
    }
  };

  const nextImage = (productId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: (prev[productId] + 1) % totalImages
    }));
  };

  const prevImage = (productId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: (prev[productId] - 1 + totalImages) % totalImages
    }));
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        setDeletingProductId(productId);
        const shopId = localStorage.getItem('shopId');
        await axios.delete(API.deleteProduct(), {
          data: {
            shopId,
            productId
          }
        });
        setSuccessMessage('Product deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchProducts();
      } catch (err) {
        setError('Error deleting product');
      } finally {
        setDeletingProductId(null);
      }
    }
  };

  // const handleAvailabilityToggle = async (productId, currentAvailability) => {
  //   try {
  //     await axios.patch(API.updateProduct(), {
  //       availability: !currentAvailability
  //     });
  //     fetchProducts();
  //   } catch (err) {
  //     setError('Error updating product availability');
  //   }
  // };

  return (
    <div className="product-list-container">
      <Header 
        title="Products"
        showAddButton={true}
        onAddClick={() => navigate('/add-product')}
      />

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {products.length === 0 ? (
        <div className="no-products">No products found</div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.images && product.images.length > 0 ? (
                  <div className="image-slider">
                    <img 
                      src={product.images[currentImageIndex[product._id]]} 
                      alt={product.name} 
                      className="product-thumbnail"
                    />
                    {product.images.length > 1 && (
                      <>
                        <button 
                          className="slider-button prev"
                          onClick={() => prevImage(product._id, product.images.length)}
                        >
                          &#10094;
                        </button>
                        <button 
                          className="slider-button next"
                          onClick={() => nextImage(product._id, product.images.length)}
                        >
                          &#10095;
                        </button>
                        <div className="image-counter">
                          {currentImageIndex[product._id] + 1} / {product.images.length}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Color:</strong> {product.color ? product.color.join(', ') : 'N/A'}</p>
                <p><strong>Size:</strong> {product.size ? product.size.join(', ') : 'N/A'}</p>
                <p><strong>Quantity:</strong> {product.quantity}</p>
                <p><strong>Price Code:</strong> {product.priceCode}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status ${product.availability ? 'available' : 'unavailable'}`}>
                    {product.availability ? 'In Stock' : 'Out of Stock'}
                  </span>
                </p>
              </div>
              <div className="product-actions">
                <button
                  className={`delete-button ${deletingProductId === product._id ? 'deleting' : ''}`}
                  onClick={() => handleDelete(product._id)}
                  disabled={deletingProductId === product._id}
                >
                  {deletingProductId === product._id ? (
                    <>
                      <span className="spinner"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash"></i>
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList; 