import React, { useState,useEffect } from 'react';
import Header from "../Main/Header.jsx";
import Footer from "../Main/Footer.jsx";
import OrderTrack from "../Components/OrderTracking/OrderTrack.jsx";
import { CartProvider } from '../Main/Constant/AddToCart.jsx';
export default function OrderTracking() {
    // ✅ Always scroll to top on page load
    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, []);
    const [query, setQuery] = useState(''); 
  return (
    <CartProvider>
    <div>
      <Header query={query} setQuery={setQuery} />
      <OrderTrack />
      <Footer />
    </div>
    </CartProvider>
  );
}
