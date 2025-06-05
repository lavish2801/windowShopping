import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../config/api';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    pin: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(API.shopLogin(), formData);
      if (response.status === 200) {
        // Store shop info in localStorage
        localStorage.setItem('shopName', response.data.name);
        localStorage.setItem('shopId', response.data._id);
        localStorage.setItem('categories', response.data.categories);
        localStorage.setItem('sizes', response.data.sizes);
        navigate('/products');
      }
    } catch (err) {
      setError('Invalid shop name or PIN');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Shop Login</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Shop Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pin">PIN:</label>
            <input
              type="password"
              id="pin"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              required
              maxLength="6"
            />
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login; 