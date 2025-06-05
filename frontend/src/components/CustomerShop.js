import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API } from '../config/api';
import './CustomerShop.css';

const CustomerShop = () => {
  const { shopUrl } = useParams();
  const [shopDetails, setShopDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [allProductIds, setAllProductIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    fetchShopDetails();
    loadWishlist();
  }, [shopUrl]);

  const loadWishlist = () => {
    const savedWishlistData = localStorage.getItem(`wishlist_${shopUrl}`);
    if (savedWishlistData) {
      const { items, timestamp } = JSON.parse(savedWishlistData);
      const now = new Date().getTime();
      // Check if the wishlist is less than 2 hours old
      if (now - timestamp < 120000) { // 86400000 ms = 24 hours
        setWishlist(items);
      } else {
        // Clear expired wishlist
        localStorage.removeItem(`wishlist_${shopUrl}`);
        setWishlist([]);
      }
    }
  };

  const fetchShopDetails = async () => {
    try {
      const response = await axios.get(API.getCustomerView(shopUrl));
      localStorage.setItem('shopId', response.data.shop.id);
      localStorage.setItem('shopName', response.data.shop.name);
      setShopDetails(response.data.shop);
      setProducts(response.data.products);
      // Save all product IDs
      const productIds = response.data.products.map(product => product.id);
      localStorage.setItem('allProductIds', JSON.stringify(productIds));
      setAllProductIds(productIds);
      setLoading(false);
    } catch (err) {
      setError('Shop not found or is currently unavailable');
      setLoading(false);
    }
  };

  const handleWishlistClick = (event, productId) => {
    // Prevent default scroll behavior
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(productId);
  };

  const toggleWishlist = (productId) => {
    // Save current scroll position
    const scrollPosition = window.scrollY;
    
    setWishlist(prevWishlist => {
      let newWishlist;
      if (prevWishlist.includes(productId)) {
        // Remove only this product from wishlist
        newWishlist = prevWishlist.filter(id => id !== productId);
      } else {
        // Add this product to existing wishlist
        newWishlist = [...prevWishlist, productId];
      }
      
      // Save wishlist with timestamp (24 hours expiration)
      const wishlistData = {
        items: newWishlist,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(`wishlist_${shopUrl}`, JSON.stringify(wishlistData));
      
      // Restore scroll position after state update
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 0);
      
      return newWishlist;
    });
  };

  const getWishlistProducts = () => {
    return products.filter(product => wishlist.includes(product.id));
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = !selectedCategory || product.category === selectedCategory;
    const sizeMatch = !selectedSize || product.size === selectedSize;
    return categoryMatch && sizeMatch;
  });

  const WishlistModal = () => {
    const wishlistProducts = getWishlistProducts();

    return (
      <div className="modal-overlay">
        <div className="modal-content wishlist-modal">
          <div className="modal-header">
            <h2>Selected Products ({wishlistProducts.length})</h2>
            <button 
              className="close-button"
              onClick={() => setShowWishlistModal(false)}
            >
              ×
            </button>
          </div>
          <div className="wishlist-items">
            {wishlistProducts.length > 0 ? (
              wishlistProducts.map(product => (
                <div key={product._id} className="wishlist-item">
                  <div className="wishlist-item-image">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="wishlist-item-details">
                    <h3>{product.name}</h3>
                    <p>Category: {product.category}</p>
                  </div>
                  <button
                    className="remove-from-wishlist"
                    onClick={(event) => handleWishlistClick(event, product._id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-wishlist">
                No products selected
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ProductCard = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const isInWishlist = wishlist.includes(product.id);

    const nextImage = () => {
      setCurrentImageIndex((prev) => 
        (prev + 1) % (product.images?.length || 1)
      );
    };

    const prevImage = () => {
      setCurrentImageIndex((prev) => 
        (prev - 1 + (product.images?.length || 1)) % (product.images?.length || 1)
      );
    };

    return (
      <div className="product-card">
        <div className="product-image-container">
          {product.images && product.images.length > 0 ? (
            <>
              <img 
                src={product.images[currentImageIndex]} 
                alt={product.name}
                className="product-image"
              />
              {product.images.length > 1 && (
                <>
                  <button className="image-nav prev" onClick={prevImage}>
                    &#10094;
                  </button>
                  <button className="image-nav next" onClick={nextImage}>
                    &#10095;
                  </button>
                  <div className="image-counter">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="no-image">No Image</div>
          )}
          <button 
            className={`wishlist-button ${isInWishlist ? 'active' : ''}`}
            onClick={(event) => handleWishlistClick(event, product.id)}
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            ♥
          </button>
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="category">{product.category}</p>
          <div className="product-details">
            <span>Color: {product.color}</span>
            <span>Size: {product.size}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="customer-shop-container">
      <header className="shop-header fixed-header">
        <div className="shop-header-content">
          <div className="shop-header-top">
            <h1>{shopDetails?.name}</h1>
            <button 
              className="wishlist-button"
              onClick={() => setShowWishlistModal(true)}
            >
              ♥ Selected Products ({wishlist.length})
            </button>
          </div>
          <div className="filters">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {shopDetails?.categories?.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select 
              value={selectedSize} 
              onChange={(e) => setSelectedSize(e.target.value)}
              className="filter-select"
            >
              <option value="">All Sizes</option>
              {shopDetails?.sizes?.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="products-grid" style={{ marginTop: '180px' }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="no-products">No products available</div>
        )}
      </div>

      {showWishlistModal && <WishlistModal />}
    </div>
  );
};

export default CustomerShop; 