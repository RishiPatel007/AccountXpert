import { React, useState, useEffect } from "react";
import getCookie from "D:/CODING/ACCOUNTXPERT/frontend/src/getCookies.js";
import { useLocation, Link, Navigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import "./Styles/Products.css";

function Products() {
  const [username, setUsername] = useState(null);
  const location = useLocation();
  const [addbutton, setAddbutton] = useState(true);
  const [products, setProducts] = useState([]);
  const [refreshId, setRefreshId] = useState();
  const [activeProduct, setActiveProduct] = useState({
    name: "",
    price: "",
    description: "",
    _id: null,
  });

  useEffect(() => {
    const getUsername = async () => {
      try {
        const user = getCookie(); // Ensure getCookie returns a Promise
        console.log("Fetched username from cookie:", user);
        setUsername(user);
      } catch (error) {
        console.error("Error fetching cookie:", error);
      }
    };

    getUsername();
  }, [location]);

  useEffect(() => {
    if (username) {
      const fetchProducts = async () => {
        console.log("Fetching products for username:", username);
        try {
          const response = await axios.get(
            "http://localhost:8000/api/get-products/",
            { params: { username } }
          );
          response.data.products.sort((a, b) => a.name.localeCompare(b.name));
          console.log("API response:", response.data);
          setProducts(response.data.products || []);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      fetchProducts();
    }
  }, [username, refreshId]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const newProduct = { ...activeProduct, username };
      const response = await axios.post(
        "http://localhost:8000/api/add-product/",
        newProduct
      );

      if (response.status === 201) {
        const newProductWithId = { ...newProduct, _id: response.data._id };

        const updatedProducts = [
          ...products,
          newProductWithId,
        ].sort((a, b) => a.name.localeCompare(b.name));
        
        setProducts(updatedProducts);
        setRefreshId(null);
        setActiveProduct({ name: "", price: "", description: "", _id: null });
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (activeProduct._id) {
      try {
        const updatedProduct = { ...activeProduct };
        const response = await axios.put(
          `http://localhost:8000/api/update-product/${activeProduct._id}/`,
          updatedProduct
        );

        if (response.status === 200) {
          const updatedProducts = products
            .map((product) =>
              product._id === activeProduct._id ? updatedProduct : product
            )
            .sort((a, b) => a.name.localeCompare(b.name));
          setProducts(updatedProducts);
          setActiveProduct({ name: "", price: "", description: "", _id: null });
          setAddbutton(true);
        }
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/delete-product/${productId}/`
      );

      if (response.status === 200) {
        const updatedProducts = products.filter(
          (product) => product._id !== productId
        );
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleListClick = (index) => {
    console.log("Selected product:", products[index]);
    setActiveProduct(products[index]);
    setAddbutton(false);
  };

  if (username === null) {
    return <div>Loading...</div>;
  }

  if (!username) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="products-container d-flex flex-column flex-lg-row">
        <div className="form-container">
          <h2>{addbutton ? "Current Product" : "Update Product"}</h2>
          <form onSubmit={addbutton ? handleAddProduct : handleUpdateProduct}>
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                value={activeProduct.name}
                onChange={(e) =>
                  setActiveProduct({ ...activeProduct, name: e.target.value })
                }
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (₹)</label>
              <input
                type="number"
                id="price"
                value={activeProduct.price}
                onChange={(e) =>
                  setActiveProduct({ ...activeProduct, price: e.target.value })
                }
                placeholder="Enter price"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={activeProduct.description}
                onChange={(e) =>
                  setActiveProduct({
                    ...activeProduct,
                    description: e.target.value,
                  })
                }
                placeholder="Enter product description"
                required
              />
            </div>

            <button
              id={addbutton ? "addButton" : "updateButton"}
              type="submit"
              className="btn btn-primary"
            >
              {addbutton ? "Add Product" : "Update Product"}
            </button>
          </form>
        </div>

        <div className="products-list">
          <h2>Product List</h2>
          {products.length > 0 ? (
            <ul>
              {products.map((product, index) => (
                <li key={product._id} className="product-item">
                  <div
                    className="product-info"
                    onClick={() => handleListClick(index)}
                  >
                    <h3>{product.name}</h3>
                    <p>Price: ₹{product.price}</p>
                  </div>
                  <span
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering handleListClick
                      handleDeleteProduct(product._id);
                    }}
                  >
                    &#x2715;
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No products added yet.</p>
          )}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default Products;
