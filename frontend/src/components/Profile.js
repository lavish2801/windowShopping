import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { API } from '../config/api';
import './Profile.css';

const Profile = () => {
  const [shopDetails, setShopDetails] = useState(null);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    fetchShopDetails();
  }, []);

  const fetchShopDetails = async () => {
    try {
      const shopId = localStorage.getItem('shopId');
      const response = await axios.get(API.getShopDetails(shopId));
      setShopDetails(response.data);
    } catch (err) {
      setError('Error fetching shop details');
    }
  };

  const copyToClipboard = () => {
    if (shopDetails?.customerUrl) {
      navigator.clipboard.writeText(shopDetails.customerUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!shopDetails) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <Header title="Shop Profile" />
      
      <div className="profile-content">
        <div className="profile-section">
          <h2>Shop Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Shop Name:</label>
              <span>{shopDetails.name}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{shopDetails.email}</span>
            </div>
            <div className="info-item">
              <label>Phone:</label>
              <span>{shopDetails.phone || 'Not provided'}</span>
            </div>
            <div className="info-item">
              <label>Address:</label>
              <span>{shopDetails.address || 'Not provided'}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Customer URL</h2>
          <div className="customer-url-container">
            <div className="url-display">
              <span>{`${shopDetails.customerUrl}`}</span>
            </div>
            <button 
              className={`copy-button ${isCopied ? 'copied' : ''}`}
              onClick={copyToClipboard}
            >
              {isCopied ? 'Copied!' : 'Copy URL'}
            </button>
          </div>
          <p className="url-description">
            Share this URL with your customers to let them browse your products.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile; 