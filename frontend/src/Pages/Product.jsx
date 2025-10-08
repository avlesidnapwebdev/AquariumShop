import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// ✅ Components
import Header from "../Main/Header.jsx";
import Footer from "../Main/Footer.jsx";
import ProductDetailsPage from "../Components/Product/ProductDetails.jsx";
import ProductFeatures from "../Components/Product/ProductFeatures.jsx";
import ProductRelated from "../Components/Product/ProductRelated.jsx";
import ProductSimilar from "../Components/Product/ProductSimilar.jsx";
import ProductRecentViews from "../Components/Product/ProductRecentViews.jsx";

// ✅ API
import { getProductById } from "../api/api.js";

export default function ProductPage({ isLoggedIn, username, onLogout }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Scroll to top and fetch product on id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        setProduct(res?.data || null);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ Categories for similar products (mock or replace with API)
  const categories = [
    { title: "Coral", data: [] },
    { title: "Hunt", data: [] },
    { title: "Fish", data: [] },
    { title: "Tank", data: [] },
    { title: "Food", data: [] },
  ];

  if (loading) {
    return (
      <>
        <Header isLoggedIn={isLoggedIn} username={username} onLogout={onLogout} />
        <div className="w-full px-4 md:px-8 lg:px-12 py-10 text-center min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-700 text-lg font-medium">Loading product...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header isLoggedIn={isLoggedIn} username={username} onLogout={onLogout} />
        <div className="w-full px-4 md:px-8 lg:px-12 py-10 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-800">Product not found</h2>
          <Link
            to="/shop"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            ← Back to Shop
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* ✅ Header */}
      <Header isLoggedIn={isLoggedIn} username={username} onLogout={onLogout} />

      {/* ✅ Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-6">
        {/* Spacer for fixed header */}
        <div className="h-[80px] md:h-[100px]"></div>

        {/* Back Links */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link
            to="/shop"
            className="px-3 py-1 bg-blue-400 text-white rounded hover:bg-blue-500 text-sm"
          >
            ❮ Back to Shop
          </Link>
        </div>

        {/* ✅ Product Details */}
        <ProductDetailsPage />

        {/* ✅ Features */}
        <ProductFeatures />

        {/* ✅ Related products slider (guard product._id) */}
        {product._id && <ProductRelated currentProductId={product._id} />}

        <div className="py-5"></div>

        {/* ✅ Similar Products */}
        <ProductSimilar categories={categories} />

        <div className="py-5"></div>

        {/* ✅ Recently Viewed (mock data) */}
        <ProductRecentViews
          recent={[
            { id: 1001, name: "Adolfo s cory", image: "/assets/fish/fish/Adolfo s cory.png" },
            { id: 1002, name: "Adonis tetra", image: "/assets/fish/fish/Adonis tetra.png" },
            { id: 1003, name: "African peacock cichlid", image: "/assets/fish/fish/African peacock cichlid.png" },
          ]}
        />
      </main>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}
