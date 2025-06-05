import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ title, showAddButton = false, onAddClick }) => {
  const navigate = useNavigate();
  const shopName = localStorage.getItem('shopName');

  const handleLogout = () => {
    localStorage.removeItem('shopId');
    localStorage.removeItem('shopName');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1>{title}</h1>
        {shopName && <span className="shop-name">{shopName}</span>}
      </div>
      <div className="header-right">
        {showAddButton && (
          <button 
            className="add-button"
            onClick={onAddClick}
          >
            Add New Product
          </button>
        )}
        <button 
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
        <button 
          className="profile-button"
          onClick={() => navigate('/profile')}
        >
          Profile
        </button>
      </div>
    </header>
  );
};

export default Header; 