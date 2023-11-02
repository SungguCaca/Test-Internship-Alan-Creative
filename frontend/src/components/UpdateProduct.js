import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

function EditProduct() {
  const { id } = useParams();
  const history = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(1); // Set the default category or fetch it from the backend

  useEffect(() => {
    // Fetch the product details for editing
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setPrice(data.price);
          setCategoryId(data.product_category_id);
        } else {
          console.error("Failed to fetch product details");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for updating the product
    const productData = {
      name,
      price,
      product_category_id: categoryId,
    };

    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert("Product updated!");
        history("/list-product");
      } else {
        const data = await response.json();
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Error: Failed to update product.");
    }
  };

  return (
    <div>
      <h1>Edit Product</h1>
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
          <label>Category ID:</label>
          <input
            type="number"
            className="form-control"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          <FontAwesomeIcon icon={faSave} /> Save
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
