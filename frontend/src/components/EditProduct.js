import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API } from '../config/api';
import './AddProduct.css';

const EditProduct = () => {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    color: '',
    size: '',
    quantity: 1,
    priceCode: '',
    availability: true
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const shopName = localStorage.getItem('shopName');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(API.getProduct(id));
      setFormData(response.data);
    } catch (err) {
      setError('Error fetching product details');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post(API.updateProduct(), {
        shopId: shopName,
        productId: id,
        updatedData: formData
      });
      navigate('/products');
    } catch (err) {
      setError('Error updating product');
    }
  };

  return (
    <div className="add-product-container">
      <h2>Edit Product</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
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
          <label htmlFor="color">Color:</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="size">Size:</label>
          <input
            type="text"
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="priceCode">Price Code:</label>
          <input
            type="text"
            id="priceCode"
            name="priceCode"
            value={formData.priceCode}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group checkbox">
          <label htmlFor="availability">
            <input
              type="checkbox"
              id="availability"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
            />
            Available in Stock
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">Update Product</button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/products')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct; 