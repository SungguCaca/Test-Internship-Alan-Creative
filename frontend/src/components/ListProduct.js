import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";

function ListProduct() {
  const [products, setProducts] = useState([]);
  const history = useNavigate();

//   useEffect(() => {
//     // Fetch the list of products from the API or your data source
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/api/products");
//         if (response.ok) {
//           const data = await response.json();
//           setProducts(data);
//         } else {
//           console.error("Failed to fetch products");
//         }
//       } catch (error) {
//         console.error("An error occurred:", error);
//       }
//     };

//     fetchData();
//   }, []);

  const handleEdit = (productId) => {
    history(`/update-products/${productId}`);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
        alert("Product deleted!");
      } else {
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <h1>Product List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.product_category_id}</td>
              <td>
                <button onClick={() => handleEdit(product.id)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(product.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add" key="add-product">
        <div onClick={() => history("/add-product")} style={{ textDecoration: "none" }}>
          <div>
            <FontAwesomeIcon icon={faPlus} size="2x" />
          </div>
          <h3>Add Product</h3>
        </div>
      </div>
    </div>
  );
}

export default ListProduct;
