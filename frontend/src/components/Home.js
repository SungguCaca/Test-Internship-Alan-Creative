import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faUser, faListUl } from "@fortawesome/free-solid-svg-icons";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      bill: [],
      customer: "   ",
      total: 0,
      categories: [
        { id: 1, name: "Cumi & Kerang", image_url: "/images/1.png" },
        { id: 2, name: "Sayuran", image_url:  "/images/2.png" },
        { id: 3, name: "Ikan", image_url:  "/images/3.png" },
        { id: 4, name: "Minuman", image_url:  "/images/4.png" },
        { id: 5, name: "Happy Hour", image_url:  "/images/5.png" },
      ],
      selectedCategory: null,
      chargeAmount: 0,
      changeAmount: 0,
      showChargePopup: false,
      showAddProduct: false, // Menambahkan state showAddProduct
    };
  }

  fetchProducts = () => {
    axios
      .get("http://localhost:8000/api/products") // Ganti dengan URL sesuai dengan backend Anda
      .then((response) => {
        this.setState({ products: response.data });
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  componentDidMount() {
    this.fetchProducts();
  }

  // Fungsi untuk menambah produk ke bill
  addToBill = (product) => {
    const bill = [...this.state.bill];
    const existingProduct = bill.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      const newProduct = { ...product, quantity: 1 };
      bill.push(newProduct);
    }

    this.setState({
      bill,
    });
  };

  // Fungsi untuk menggandakan atau mengurangi jumlah produk dalam bill
  toggleBillItem = (product, increment) => {
    const bill = [...this.state.bill];
    const existingProduct = bill.find((item) => item.id === product.id);

    if (existingProduct) {
      if (increment) {
        existingProduct.quantity++;
      } else {
        if (existingProduct.quantity > 1) {
          existingProduct.quantity--;
        } else {
          // Hapus produk dari bill jika kuantitas 1
          const productIndex = bill.indexOf(existingProduct);
          bill.splice(productIndex, 1);
        }
      }

      this.setState({
        bill,
      });
    }
  };

  // Fungsi untuk menghitung total belanjaan
  calculateTotal = () => {
    return this.state.bill.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  // Fungsi untuk membersihkan isi bill
  clearBill = () => {
    this.setState({
      bill: [],
    });
  };

  saveBill = () => {
    alert("Saved!");
  };

  printBill = () => {
    alert("Printing bill...");
  };

  charge = () => {
    const total = this.calculateTotal();
    const chargeAmount = prompt("Masukkan jumlah uang pembeli:", total);
    if (chargeAmount !== null) {
      const changeAmount = chargeAmount - total;
      if (changeAmount < 0) {
        alert("Uang pembeli kurang!");
      } else {
        this.setState({
          chargeAmount,
          changeAmount,
        });
      }
    }
  };

  filterProductsByCategory = (categoryId) => {
    if (categoryId === null) {
      return this.state.products;
    }
    return this.state.products.filter(
      (product) => product.category_id === categoryId
    );
  };

  render() {
    return (
      <div className="App">
        <div className="menu">
          <div className="product-list">
            <React.Fragment>
              {this.filterProductsByCategory(this.state.selectedCategory).map(
                (product) => (
                  <div
                    className="product"
                    key={product.id}
                    onClick={() => this.addToBill(product)}
                  >
                    <img
                      src={`http://localhost:8000/storage/${product.image}`}
                      alt={product.name}
                    />
                    <h3>{product.name}</h3>
                  </div>
                )
              )}
              <div className="product" key="list-product">
                <a href="/list-product" style={{ textDecoration: "none" }}>
                  <div>
                    <FontAwesomeIcon icon={faPlus} size="2x" />
                  </div>
                  <h3>Add / delete</h3>
                </a>
              </div>
            </React.Fragment>
          </div>
        </div>
        <div className="categories">
          {this.state.categories.map((category) => (
            <div
              key={category.id}
              onClick={() => this.setState({ selectedCategory: category.id })}
              className={
                this.state.selectedCategory === category.id
                  ? "category selected"
                  : "category"
              }
            >
              <img src={category.image_url} alt={category.name} />
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
        <div className="bill">
          <h2>{this.state.customer}</h2>
          <div className="bill-header">
            <div className="profile">
              <FontAwesomeIcon icon={faUser} size="2x" />
             
            </div>
            <p>New Customer</p>
            <FontAwesomeIcon icon={faListUl} size="2x" />
          </div>

          <h6>Dine In</h6>
          <div className="bill-list">
            {this.state.bill.length > 0 ? (
              this.state.bill.map((product, index) => (
                <div key={product.id} className="bill-item">
                  <p>
                    {product.name}{" "}
                    {product.quantity > 1 ? `x${product.quantity}` : ""}
                  </p>
                  <p>Rp.{product.price}</p>
                </div>
              ))
            ) : (
              <p>Belum ada produk</p>
            )}
          </div>
          <p>Sub-Total: Rp{this.calculateTotal().toFixed(0)}</p>
          <p>Total: Rp{this.calculateTotal().toFixed(0)}</p>
          <button onClick={this.clearBill} className="clear-button">
            Clear Sale
          </button>
          <div className="bill-buttons">
            <button onClick={this.saveBill}>Save Bill</button>
            <button onClick={this.printBill}>Print Bill</button>
          </div>
          <div className="bill-buttons">
            <button onClick={this.charge}>Charge</button>
          </div>
          {this.state.chargeAmount > 0 && (
            <div className="change-amount">
              <p>Uang Pembeli: Rp{this.state.chargeAmount}</p>
              <p>Kembalian: Rp{this.state.changeAmount}</p>
              <button
                onClick={() =>
                  this.setState({ chargeAmount: 0, changeAmount: 0 })
                }
              >
                OK
              </button>
            </div>
          )}
        </div>
        {/* Pop-up untuk proses charge */}
        {this.state.showChargePopup && (
          <div className="popup">
            <div className="popup-inner">
              <h2>Total Charge: Rp{this.calculateTotal().toFixed(0)}</h2>
              <input
                type="number"
                placeholder="Jumlah uang pembeli"
                value={this.state.chargeAmount}
                onChange={(e) =>
                  this.setState({ chargeAmount: e.target.value })
                }
              />
              <h3>Kembalian: Rp{this.state.changeAmount.toFixed(0)}</h3>
              <button onClick={this.hideChargePopup}>OK</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Home;
