import axios from "axios";

/* ============================================================
   BASE URL CONFIGURATION
============================================================ */
const ENV_URL = import.meta.env.VITE_API_URL;
const DEFAULT_PROD_URL = "https://aquariumshop.onrender.com";

// Ensure base URL ends with /api
const normalizeBase = (url) => {
  if (!url) return "";
  const trimmed = url.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const BASE = normalizeBase(ENV_URL || DEFAULT_PROD_URL);
console.log("🧩 Using API Base URL:", BASE);

/* ============================================================
   AXIOS INSTANCE
============================================================ */
const API = axios.create({
  baseURL: BASE,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ============================================================
   REQUEST INTERCEPTOR — Attach JWT
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
   RESPONSE INTERCEPTOR — Handle errors
============================================================ */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isNetworkError = !error.response;

    if (status === 401) {
      console.warn("⚠️ Unauthorized request detected");
      // Optionally: redirect to login or refresh token
    } else if (isNetworkError) {
      console.error("🚨 Network/CORS error:", error.message);
    } else if (status >= 500) {
      console.error("🔥 Server error:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

/* ============================================================
   AUTH ENDPOINTS
============================================================ */
export const registerAPI = async (data) => {
  if (!data.email || !data.password) throw new Error("Email and password required");
  const res = await API.post("/auth/register", data);
  if (res.data?.token) localStorage.setItem("token", res.data.token);
  return res.data;
};

export const loginAPI = async (data) => {
  if (!data.email && !data.mobile) throw new Error("Email or mobile required");
  if (!data.password) throw new Error("Password required");
  const res = await API.post("/auth/login", data);
  if (res.data?.token) localStorage.setItem("token", res.data.token);
  return res.data;
};

/* ============================================================
   PRODUCTS
============================================================ */
export const getProducts = async () => {
  const res = await API.get("/products", { headers: { "Cache-Control": "no-cache" } });
  return res.data.map((p) => ({
    ...p,
    image: p.image?.startsWith("http") ? p.image : `${BASE.replace("/api", "")}${p.image}`,
  }));
};

export const getProductById = async (id) => {
  const res = await API.get(`/products/${id}`);
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
   CART
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
   WISHLIST
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
   ORDERS
============================================================ */
export const placeOrder = (data) => API.post("/orders", data);
export const getMyOrders = () => API.get("/orders");
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

/* ============================================================
   PAYMENTS
============================================================ */
export const createRazorpayOrder = (data) => API.post("/payments/razorpay/create", data);
export const verifyRazorpayPayment = (data) => API.post("/payments/razorpay/verify", data);

/* ============================================================
   USER PROFILE
============================================================ */
export const getProfileAPI = () => API.get("/users/profile");
export const updateProfileAPI = (formData) => API.put("/users/profile", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

export const addAddress = (data) => API.post("/users/addresses", data);
export const updateAddress = (id, data) => API.put(`/users/addresses/${id}`, data);
export const removeAddress = (id) => API.delete(`/users/addresses/${id}`);
export const setDefaultAddress = (id) => API.put(`/users/addresses/default/${id}`);

export const addCard = (data) => API.post("/users/cards", data);
export const removeCard = (id) => API.delete(`/users/cards/${id}`);
export const setDefaultCard = (id) => API.put(`/users/cards/default/${id}`);
export const deleteUser = () => API.delete("/users");

export default API;
