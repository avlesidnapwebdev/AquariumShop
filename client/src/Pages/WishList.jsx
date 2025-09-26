import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../Main/Constant/Wishlist.jsx";
import { useCart } from "../Main/Constant/AddToCart.jsx";

// ✅ Components
import Header from "../Main/Header.jsx";
import Footer from "../Main/Footer.jsx";
import ProductRecentViews from "../Components/Product/ProductRecentViews.jsx";

// ✅ Assets (demo recent views)
import fish1 from "../assets/fish/fish/Adolfo s cory.png";
import fish2 from "../assets/fish/fish/Adonis tetra.png";
import fish3 from "../assets/fish/fish/African peacock cichlid.png";

export default function Wishlist({ isLoggedIn, username, onLogout }) {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // ✅ Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-white text-blue-500 min-h-screen flex flex-col">
      {/* Header */}
      <Header isLoggedIn={isLoggedIn} username={username} onLogout={onLogout} />

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-6">
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

        {/* Wishlist Items */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-6 mx-auto">
          <h2 className="text-2xl font-semibold mb-6">My Wishlist</h2>

          {wishlistItems.length === 0 ? (
            <p className="text-center text-gray-500">Your wishlist is empty.</p>
          ) : (
            <div className="divide-y">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row justify-between items-center py-4 gap-4"
                >
                  {/* Left: Product Info */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(item)}
                      className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="py-5"></div>
        {/* Recently Viewed */}
        <ProductRecentViews
          recent={[
            { id: 1001, name: "Adolfo s cory", image: fish1 },
            { id: 1002, name: "Adonis tetra", image: fish2 },
            { id: 1003, name: "African peacock cichlid", image: fish3 },
          ]}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
