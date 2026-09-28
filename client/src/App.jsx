const API_URL = import.meta.env.VITE_API_URL;
import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Components/Navbar.jsx";
import ProductCard from "./Components/ProductCard.jsx";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";

function App() {
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = [
    ...new Map(
      products.map((product) => {
        const category = (product.category || "").trim();

        return [category.toLowerCase(), category];
      })
    ).values(),
  ];

const filteredProducts = products.filter((product) => {
  const productName = (product.name || "").toLowerCase();
  const productCategory = (product.category || "").toLowerCase();

  return (
    productName.includes(searchTerm.toLowerCase()) &&
    (categoryFilter === "All" ||
      productCategory === categoryFilter.toLowerCase())
  );
});

  const lowStockProducts = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  );

  const outOfStockProducts = products.filter(
    (product) => product.stock === 0
  );

  const [editingId, setEditingId] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    setLoading(true);

    fetch(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
  setProducts(data);
})
      .catch((error) => {
        console.error(error);
        setError("Unable to connect to the server.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name.trim() || !category.trim()) {
    setError("Product name and category are required.");
    return;
  }

  if (Number(stock) < 0) {
    setError("Stock cannot be negative.");
    return;
  }

  try {
      const productData = {
        name: name,
        category: category,
        stock: Number(stock),
      };

      if (editingId !== null) {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/products/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
          }
        );

        const updatedProduct = await response.json();

        if (!response.ok) {
          throw new Error(
            updatedProduct.detail || "Failed to update product"
          );
        }

        setProducts(
          products.map((product) =>
            product.id === editingId ? updatedProduct : product
          )
        );

        setEditingId(null);
      } else {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/products`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
          }
        );

        const newProduct = await response.json();

        if (!response.ok) {
          throw new Error(
            newProduct.detail || "Failed to add product"
          );
        }

        setProducts([...products, newProduct]);
      }

      setName("");
      setCategory("");
      setStock("");
    } catch (error) {
      console.error(error);
      setError("Unable to save product. Please try again.");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setStock(product.stock);

    document.getElementById("product-form")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleStockChange = async (id, change) => {
    const product = products.find((product) => product.id === id);

    if (!product) {
      return;
    }

    const newStock = product.stock + change;

    if (newStock < 0) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: product.name,
            category: product.category,
            stock: newStock,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update stock");
      }

      const updatedProduct = await response.json();

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === id ? updatedProduct : product
        )
      );
    } catch (error) {
      console.error(error);
      setError("Unable to update stock. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setCategory("");
    setStock("");
  };

  const handleDelete = (productId) => {
    setDeleteProductId(productId);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/products/${deleteProductId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(
        products.filter(
          (product) => product.id !== deleteProductId
        )
      );

      setDeleteProductId(null);
    } catch (error) {
      console.error(error);
      setError("Unable to delete product. Please try again.");
    }
  };

  if (!token) {
    if (window.location.pathname === "/register") {
      return <Register />;
    }

    return <Login />;
  }

  return (
    <div className="app-container">
      <Navbar title="My Inventory Dashboard" />

      <div className="dashboard-content">
        <h1>Inventory Management System</h1>

        <p>Manage products and monitor stock levels</p>

        <h2 id="dashboard-section">Dashboard Summary</h2>

        <div className="summary-grid">
          <div className="summary-card">
            <h3>Total Products</h3>
            <p>{products.length}</p>
          </div>

          <div className="summary-card">
            <h3>Total Stock</h3>
            <p>
              {products.reduce(
  (total, product) => total + (Number(product.stock) || 0),
  0
)}
            </p>
          </div>

          <div className="summary-card">
            <h3>Low Stock</h3>
            <p>{lowStockProducts.length}</p>
          </div>

          <div className="summary-card">
            <h3>Out of Stock</h3>
            <p>{outOfStockProducts.length}</p>
          </div>
        </div>

        <h2>
          {editingId !== null
            ? "Edit Product"
            : "Add New Product"}
        </h2>

        <form
          id="product-form"
          onSubmit={handleSubmit}
          className="product-form"
        >
          <input
            className="form-input"
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="form-input"
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <input
            className="form-input"
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            min="0"
          />

          <button className="submit-button" type="submit">
            {editingId !== null
              ? "Update Product"
              : "Add Product"}
          </button>

          {editingId !== null && (
            <button
              className="cancel-button"
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel Edit
            </button>
          )}
        </form>

        <h2 id="products-section">Product List</h2>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading && <p>Loading products...</p>}

        {error && <p>{error}</p>}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <p>
              No products found. Add a product to get started.
            </p>
          )}

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={`product-${product.id}`}
              product={product}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onStockChange={handleStockChange}
            />
          ))}
        </div>

        {deleteProductId !== null && (
          <div className="delete-modal">
            <div className="delete-modal-content">
              <h2>Delete Product?</h2>

              <p>
                Are you sure you want to delete this product?
              </p>

              <button
                onClick={() => {
                  setDeleteProductId(null);
                }}
              >
                Cancel
              </button>

              <button onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;