import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import Home from "./components/Home";
import AddProduct from "./components/AddProduct";
import ListProduct from "./components/ListProduct";
import UpdateProduct from "./components/UpdateProduct";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route index element={<Home />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="list-product" element={<ListProduct />} />
            <Route path="update-products/:id" element={<UpdateProduct />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
