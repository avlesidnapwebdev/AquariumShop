import axios from "axios";

/* ============================================================
   ✅ BASE URL CONFIGURATION — PRODUCTION ONLY (Render Backend)
============================================================ */

// 🔹 Always use environment variable first
const envUrl = import.meta.env.VITE_API_URL;

// 🔹 Fallback if env variable missing
const DEFAULT_PROD_URL = "https://aquariumshop.onrender.com";

// 🔹 Helper: Normalize API path
const normalizeBase = (url) => {
  if (!url) return "";
  const trimmed = url.replace(/\/+$/, ""); // remove trailing slashes
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

// 🔹 Final base URL (Render only)
const BASE = normalizeBase(envUrl || DEFAULT_PROD_URL);

console.log("🧩 Using API Base URL:", BASE);

/* ============================================================
   ✅ AXIOS INSTANCE
============================================================ */
const API = axios.create({
  baseURL: BASE,
  timeout: 15000, // increased timeout for production stability
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
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
   ✅ RESPONSE INTERCEPTOR (Prevent Infinite Reload)
============================================================ */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isNetworkError = !error.response;

    // 🚫 Avoid reload loops on Netlify
    if (status === 401) {
      localStorage.removeItem("token");
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    } else if (isNetworkError) {
      console.error("🚨 Network or CORS error:", error.message);
    }

    return Promise.reject(error);
  }
);

/* ============================================================
   ✅ AUTH ENDPOINTS
============================================================ */
export const registerAPI = (data) => API.post("/auth/register", data);
export const loginAPI = (data) => API.post("/auth/login", data);

/* ============================================================
   ✅ PRODUCT ENDPOINTS
============================================================ */
export const getProducts = async () => {
  const res = await API.get("/products", { headers: { "Cache-Control": "no-cache" } });
  return res.data.map((p) => ({
    ...p,
    image: p.image?.startsWith("http") ? p.image : `${BASE.replace("/api", "")}${p.image}`,
  }));
};

export const getProductById = async (id) => {
  const res = await API.get(`/products/${id}`, { headers: { "Cache-Control": "no-cache" } });
  const p = res.data;
  return {
    ...p,
    image: p.image?.startsWith("http") ? p.image : `${BASE.replace("/api", "")}${p.image}`,
  };
};

export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

/* ============================================================
   ✅ CART ENDPOINTS
============================================================ */
export const getCart = () => API.get("/cart");
export const addToCart = ({ productId, quantity = 1 }) => {
  if (!productId) throw new Error("productId is required");
  return API.post("/cart/add", { productId, quantity });
};
export const updateCartItem = (productId, { quantity }) => {
  if (!productId) throw new Error("productId is required");
  return API.put(`/cart/item/${productId}`, { quantity });
};
export const clearCart = () => API.delete("/cart/clear");

/* ============================================================
   ✅ ORDER ENDPOINTS
============================================================ */
export const placeOrder = (data) => API.post("/orders", data);
export const getMyOrders = () => API.get("/orders");
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

/* ============================================================
   ✅ PAYMENT (Razorpay) ENDPOINTS
============================================================ */
export const createRazorpayOrder = (data) => API.post("/payments/razorpay/create", data);
export const verifyRazorpayPayment = (data) => API.post("/payments/razorpay/verify", data);

/* ============================================================
   ✅ USER ENDPOINTS
============================================================ */
export const getProfileAPI = () => API.get("/users/profile");
export const updateProfileAPI = (formData) =>
  API.put("/users/profile", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const addAddress = (data) => API.post("/users/addresses", data);
export const updateAddress = (id, data) => API.put(`/users/addresses/${id}`, data);
export const removeAddress = (id) => API.delete(`/users/addresses/${id}`);
export const setDefaultAddress = (id) => API.put(`/users/addresses/default/${id}`);

export const addCard = (data) => API.post("/users/cards", data);
export const removeCard = (id) => API.delete(`/users/cards/${id}`);
export const setDefaultCard = (id) => API.put(`/users/cards/default/${id}`);
export const deleteUser = () => API.delete("/users");

/* ============================================================
   ✅ WISHLIST ENDPOINTS
============================================================ */
export const getWishlist = () => API.get("/wishlist");
export const addToWishlist = (productId) => {
  if (!productId) throw new Error("productId is required");
  return API.post("/wishlist/add", { productId });
};
export const removeFromWishlist = (productId) => {
  if (!productId) throw new Error("productId is required");
  return API.delete(`/wishlist/remove/${productId}`);
};
export const clearWishlist = () => API.delete("/wishlist/clear");

/* ============================================================
   ✅ DEFAULT EXPORT
============================================================ */
export default API;
