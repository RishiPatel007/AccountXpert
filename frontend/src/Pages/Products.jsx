import { React, useState, useEffect } from "react";
import getCookie from "D:/CODING/ACCOUNTXPERT/frontend/src/getCookies.js";
import { useLocation, Link, Navigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import "./Styles/Products.css";
import * as Yup from "yup";

function Products() {
  const [username, setUsername] = useState(null);
  const location = useLocation();
  const [addbutton, setAddbutton] = useState(true);
  const [products, setProducts] = useState([]);
  const [refreshId, setRefreshId] = useState();
  const [errors, setErrors] = useState({});

  const productSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Product name is too short!")
      .max(50, "Product name is too long!")
      .required("Product name is required"),
    price: Yup.number()
      .min(0, "Price must be a positive number")
      .required("Price is required"),
    description: Yup.string()
      .min(10, "Description is too short!")
      .max(200, "Description is too long!")
      .required("Description is required"),
  });

  const [activeProduct, setActiveProduct] = useState({
    name: "",
    price: "",
    description: "",
    _id: null,
  });

  useEffect(() => {
    const getUsername = async () => {
      try {
        const user = getCookie();
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
      await productSchema.validate(activeProduct, { abortEarly: false });

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
        setErrors({});
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        console.log(error.inner)
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error("Error adding product:", error);
      }
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (activeProduct._id) {
      try {
        await productSchema.validate(activeProduct, { abortEarly: false });

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
          setErrors({}); 
        }
      } catch (error) {
        if (error.name === "ValidationError") {
          const validationErrors = {};
          error.inner.forEach((err) => {
            validationErrors[err.path] = err.message;
          });
          setErrors(validationErrors);
        } else {
          console.error("Error updating product:", error);
        }
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
          <h2>{addbutton ? "Add Product" : "Update Product"}</h2>
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
                className={errors.name ? "form-control is-invalid" : "form-control"}
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
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
                className={errors.price ? "form-control is-invalid" : "form-control"}
              />
              {errors.price && <div className="text-danger">{errors.price}</div>}
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
                className={errors.description ? "form-control is-invalid" : "form-control"}
              />
              {errors.description && (
                <div className="text-danger">{errors.description}</div>
              )}
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
