import axios from "axios";

// 👉 Base URL of your backend
// In dev: http://localhost:5000
// In production: set REACT_APP_API_URL in .env
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// 👉 Attach JWT token automatically if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ========== AUTH ========== */
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

/* ========== PRODUCTS ========== */
export const getProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

/* ========== CART ========== */
export const getCart = () => API.get("/cart");
export const addToCart = (productId, quantity = 1) =>
  API.post("/cart/add", { productId, quantity });
export const updateCartItem = (productId, quantity) =>
  API.put(`/cart/item/${productId}`, { quantity });
export const clearCart = () => API.delete("/cart/clear");

/* ========== ORDERS ========== */
export const placeOrder = (data) => API.post("/orders", data);
export const getMyOrders = () => API.get("/orders");
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}/status`, { status });

/* ========== PAYMENTS ========== */
export const createRazorpayOrder = (orderId) =>
  API.post("/payments/razorpay/create", { orderId });
export const verifyRazorpayPayment = (data) =>
  API.post("/payments/razorpay/verify", data);

/* ========== USER ========== */
export const getProfile = () => API.get("/users/profile");
export const updateProfile = (formData) =>
  API.put("/users/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const addAddress = (data) => API.post("/users/addresses", data);
export const updateAddress = (id, data) =>
  API.put(`/users/addresses/${id}`, data);
export const removeAddress = (id) => API.delete(`/users/addresses/${id}`);

export const addCard = (data) => API.post("/users/cards", data);
export const removeCard = (id) => API.delete(`/users/cards/${id}`);
export const deleteUser = () => API.delete("/users");

/* ========== WISHLIST ========== */
export const getWishlist = () => API.get("/wishlist");
export const addToWishlist = (productId) =>
  API.post("/wishlist/add", { productId });
export const removeFromWishlist = (productId) =>
  API.delete(`/wishlist/remove/${productId}`);
