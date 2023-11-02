import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(1); // Ganti dengan kategori default
  const [image, setImage] = useState(null);
  const history = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("product_category_id", +categoryId); // Convert to integer
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:8000/api/addProduct", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Product added!");
        history("/"); 
        const data = await response.json();
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Error: Failed to add product.");
    }
  };

  return (
    <div>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="text"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select
            className="form-control"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="1">Cumi & Kerang</option>
            <option value="2">Sayuran</option>
            <option value="3">Ikan</option>
            <option value="4">Minuman</option>
            <option value="5">Happy Hour</option>
          </select>
        </div>

        <div className="form-group">
          <label>Image:</label>
          <input
            type="file"
            className="form-control-file"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
