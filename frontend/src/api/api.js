import axios from "axios";

/* ============================================================
   ✅ BASE URL CONFIGURATION (Vite/React-compatible)
============================================================ */
const envUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL;
const normalizeBase = (url) => {
  if (!url) return "http://localhost:5000/api";
  const trimmed = url.replace(/\/+$/, ""); // remove trailing slashes
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};
const BASE = normalizeBase(envUrl);

/* ============================================================
   ✅ AXIOS INSTANCE
============================================================ */
const API = axios.create({
  baseURL: BASE,
  timeout: 10000,
});

/* ============================================================
   ✅ REQUEST INTERCEPTOR (Attach JWT)
============================================================ */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================================================
   ✅ RESPONSE INTERCEPTOR (Handle 401)
============================================================ */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("Unauthorized — clearing token and redirecting to /login");
      localStorage.removeItem("token");
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* ============================================================
   ✅ AUTH ENDPOINTS
============================================================ */
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const registerAPI = register;
export const loginAPI = login;

/* ============================================================
   ✅ PRODUCT ENDPOINTS
============================================================ */
export const getProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

/* ============================================================
   ✅ CART ENDPOINTS
============================================================ */
export const getCart = () => API.get("/cart");
export const addToCart = ({ productId, quantity = 1 }) => {
  if (!productId) throw new Error("productId is required"); // extra safety
  return API.post("/cart/add", { productId, quantity });
};
  
export const updateCartItem = (productId, { quantity }) =>
  API.put(`/cart/item/${productId}`, { quantity });
export const clearCart = () => API.delete("/cart/clear");

/* ============================================================
   ✅ ORDER ENDPOINTS
============================================================ */
export const placeOrder = (data) => API.post("/orders", data);
export const getMyOrders = () => API.get("/orders");
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}/status`, { status });

/* ============================================================
   ✅ PAYMENT (Razorpay) ENDPOINTS
============================================================ */
export const createRazorpayOrder = (data) =>
  API.post("/payments/razorpay/create", data);
export const verifyRazorpayPayment = (data) =>
  API.post("/payments/razorpay/verify", data);

/* ============================================================
   ✅ USER ENDPOINTS
============================================================ */
export const getProfile = () => API.get("/users/profile");
export const getProfileAPI = getProfile; // ✅ alias
export const updateProfile = (formData) =>
  API.put("/users/profile", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateProfileAPI = updateProfile;

export const addAddress = (data) => API.post("/users/addresses", data);
export const updateAddress = (id, data) => API.put(`/users/addresses/${id}`, data);
export const removeAddress = (id) => API.delete(`/users/addresses/${id}`);
export const setDefaultAddress = (addressId) =>
  API.put(`/users/addresses/default/${addressId}`);

/* ============================================================
   ✅ CARD ENDPOINTS
============================================================ */
export const addCard = (data) => API.post("/users/cards", data);
export const removeCard = (id) => API.delete(`/users/cards/${id}`);
export const setDefaultCard = (cardId) => API.put(`/users/cards/default/${cardId}`);
export const deleteUser = () => API.delete("/users");

/* ============================================================
   ✅ WISHLIST ENDPOINTS
============================================================ */
export const getWishlist = () => API.get("/wishlist");
export const addToWishlist = (productId) => API.post("/wishlist/add", { productId });
export const removeFromWishlist = (productId) => API.delete(`/wishlist/remove/${productId}`);

/* ============================================================
   ✅ DEFAULT EXPORT
============================================================ */
export default API;
