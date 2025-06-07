import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from '../config/api';
import "./AddProduct.css";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    color: ["default"],
    size: ["default"],
    quantity: 1,
    priceCode: "",
    availability: true,
    images: [],
    newCategory: false,
    newSize: false,
  });
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [error, setError] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCategories = localStorage.getItem("categories") || "";
    const storedSizes = localStorage.getItem("sizes") || "";

    setCategories(
      storedCategories
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    );
    setSizes(
      storedSizes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    );
  }, []);

  useEffect(() => {
    if (showCamera) {
      startCamera();
    }
    return () => stopCamera();
  }, [showCamera]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Error accessing camera");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

      const base64Image = canvas.toDataURL("image/jpeg");
      handleImageUpload([base64Image]);
      setShowCamera(false);
    }
  };

  const handleImageUpload = async (files) => {
    try {
      const newImages = await Promise.all(
        Array.from(files).map(async (file) => {
          const base64 =
            typeof file === "string"
              ? file
              : await new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result);
                  reader.readAsDataURL(file);
                });
          return { base64, preview: base64 };
        })
      );

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    } catch (err) {
      setError("Error processing images");
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "size" || name === "color") {
      const options = e.target.options;
      const selectedValues = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      setFormData((prev) => ({
        ...prev,
        [name]: selectedValues,
      }));
    } else if (name === "category" && value === "new") {
      setFormData((prev) => ({ ...prev, [name]: "", newCategory: true }));
    } else if (name === "size" && value === "new") {
      setFormData((prev) => ({ ...prev, [name]: "", newSize: true }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        newCategory: name === "category" ? false : prev.newCategory,
        newSize: name === "size" ? false : prev.newSize,
      }));
    }
  };

  const handleColorClick = (color) => {
    setFormData(prev => {
      const colors = prev.color.includes(color)
        ? prev.color.filter(c => c !== color)
        : [...prev.color, color];
      return { ...prev, color: colors };
    });
  };

  const handleSizeClick = (size) => {
    setFormData(prev => {
      const sizes = prev.size.includes(size)
        ? prev.size.filter(s => s !== size)
        : [...prev.size, size];
      return { ...prev, size: sizes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Update localStorage with new category/size if needed
      if (
        formData.newCategory &&
        formData.category &&
        !categories.includes(formData.category)
      ) {
        const updatedCategories = [...categories, formData.category];
        localStorage.setItem("categories", updatedCategories.join(","));
        setCategories(updatedCategories);
      }

      if (formData.newSize && formData.size && !sizes.includes(formData.size)) {
        const updatedSizes = [...sizes, formData.size];
        localStorage.setItem("sizes", updatedSizes.join(","));
        setSizes(updatedSizes);
      }

      const { newCategory, newSize, images, ...productData } = formData;
      const products = [
        {
          ...productData,
          images: images.map((img) => img.base64),
        },
      ];
      console.log(products);
      const response = await axios.post(
        API.addProduct(),
        {
          shopId: localStorage.getItem("shopId"),
          products,
        }
      );
      if (response.status===200) {
        navigate("/products");
      } else {
        setError(response.data.message || "Error adding product");
      }
    } catch (err) {
      setError("Error adding product");
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label>Product Images:</label>
          <div className="image-upload-container">
            <div className="image-upload-actions">
              <button
                type="button"
                className="upload-button"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose from Gallery
              </button>
              <button
                type="button"
                className="camera-button"
                onClick={() => setShowCamera(!showCamera)}
              >
                {showCamera ? "Close Camera" : "Take Photo"}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e.target.files)}
              style={{ display: "none" }}
            />

            {showCamera && (
              <div className="camera-container">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="camera-preview"
                />
                <button
                  type="button"
                  className="capture-button"
                  onClick={captureImage}
                >
                  Capture
                </button>
              </div>
            )}

            <div className="image-preview-container">
              {formData.images.map((image, index) => (
                <div key={index} className="image-preview">
                  <img src={image.preview} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.newCategory ? "new" : formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
            {/* <option value="new">+ Add New Category</option> */}
          </select>
          {/* {formData.newCategory && (
            <input
              type="text"
              placeholder="Enter new category"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="new-input"
              required
            />
          )} */}
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
          {/* <label>Colors:</label> */}
          {/* <div className="color-blocks">
            {["Red", "Blue", "Green", "Black", "White", "Yellow", "Purple", "Pink", "Orange", "Brown", "Gray"].map((color) => (
              <div
                key={color}
                className={`color-block ${formData.color.includes(color) ? 'selected' : ''}`}
                style={{ backgroundColor: color.toLowerCase() }}
                onClick={() => handleColorClick(color)}
              >
                {color}
              </div>
            ))}
          </div> */}
        </div>

        {/* <div className="form-group">
          <label>Sizes:</label>
          <div className="size-blocks">
            {sizes.map((size) => (
              <div
                key={size}
                className={`size-block ${formData.size.includes(size) ? 'selected' : ''}`}
                onClick={() => handleSizeClick(size)}
              >
                {size}
              </div>
            ))}
          </div>
          {formData.newSize && (
            <input
              type="text"
              placeholder="Enter new size"
              value={formData.size[formData.size.length - 1] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  size: [...prev.size.slice(0, -1), e.target.value],
                }))
              }
              className="new-input"
              required
            />
          )}
        </div> */}

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
          <button type="submit" className="submit-button">
            Add Product
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/products")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
