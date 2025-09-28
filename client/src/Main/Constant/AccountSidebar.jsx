// Constant/AccountSidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaUser,
  FaBox,
  FaHeart,
  FaCreditCard,
  FaMapMarkerAlt,
  FaEdit,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";

import WishlistSidebar from "./WishlistSidebar.jsx";
import MyOrders from "./MyOrderSideBar.jsx";
import EditProfile from "./EditProfile.jsx";
import SaveCards from "./SaveCards.jsx";
import SaveAddress from "./SaveAddress.jsx";

export default function AccountSidebar({
  isOpen,
  toggleSidebar,
  username = "Guest",
  toggleWishlist,
  isLoggedIn = false,
  onLogout = () => {},
}) {
  const navigate = useNavigate();

  // Local sub-sidebars
  const [localWishlistOpen, setLocalWishlistOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cardsOpen, setCardsOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);

  // Current user info
  const [currentProfilePic, setCurrentProfilePic] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(username);

  // keep sidebar username in sync with props
  useEffect(() => {
    setCurrentUsername(username);
  }, [username]);

  const recentProducts = [];

  const openWishlist = (e) => {
    e?.stopPropagation?.();
    toggleSidebar?.();
    if (typeof toggleWishlist === "function") {
      toggleWishlist();
    } else {
      setLocalWishlistOpen(true);
    }
  };

  // ✅ Update sidebar when profile is edited
  const handleProfileUpdate = (data) => {
    setCurrentUsername(data.fullName || currentUsername);
    setCurrentProfilePic(data.profilePic || currentProfilePic);
  };

  // ✅ only logged-in users get full menu
  const menuItems = isLoggedIn
    ? [
        {
          id: 1,
          label: "My Orders",
          icon: <FaBox />,
          onClick: () => {
            toggleSidebar?.();
            setOrdersOpen(true);
          },
        },
        { id: 2, label: "Wishlist", icon: <FaHeart />, onClick: openWishlist },
        {
          id: 3,
          label: "Edit Profile",
          icon: <FaEdit />,
          onClick: () => {
            toggleSidebar?.();
            setProfileOpen(true);
          },
        },
        {
          id: 4,
          label: "Saved Cards",
          icon: <FaCreditCard />,
          onClick: () => {
            toggleSidebar?.();
            setCardsOpen(true);
          },
        },
        {
          id: 5,
          label: "Saved Address",
          icon: <FaMapMarkerAlt />,
          onClick: () => {
            toggleSidebar?.();
            setAddressOpen(true);
          },
        },
      ]
    : []; // guests see no account menu

  return (
    <>
      {/* Main Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-5 right-5 text-2xl text-blue-700"
          onClick={(e) => {
            e.stopPropagation();
            toggleSidebar?.();
          }}
        >
          <FaTimes />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 mt-12">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {currentProfilePic ? (
              <img
                src={currentProfilePic}
                alt="Profile"
                className="w-full h-full object-contain"
              />
            ) : (
              <FaUser className="text-xl text-blue-600" />
            )}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800">
              {isLoggedIn ? currentUsername : "Guest"}
            </h4>
            <p className="text-sm text-gray-500">
              {isLoggedIn ? "Manage your account" : "Welcome, please login"}
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-4 mt-8 px-6">
          {menuItems.map(({ id, label, icon, onClick }) => (
            <button
              key={id}
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
              }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
            >
              <span className="text-blue-600">{icon}</span>
              {label}
            </button>
          ))}

          {/* Login / Logout */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isLoggedIn) {
                onLogout();
              } else {
                navigate("/login");
              }
              toggleSidebar?.();
            }}
            className={`flex items-center gap-4 p-3 rounded-lg font-medium mt-4 ${
              isLoggedIn
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <span className="text-white">
              {isLoggedIn ? <FaSignOutAlt /> : <FaSignInAlt />}
            </span>
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>

        {/* Recently Viewed */}
        <div className="mt-10 px-6">
          <h3 className="text-md font-bold text-blue-600 mb-3">
            Recently Viewed
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentProducts.length > 0 ? (
              recentProducts.map((src, index) => (
                <div
                  key={index}
                  className="min-w-[80px] h-[80px] rounded-lg shadow-md flex-shrink-0 bg-white"
                >
                  <img
                    src={src}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent products</p>
            )}
          </div>
        </div>
      </div>

      {/* Local Sub-Sidebars */}
      {!toggleWishlist && (
        <WishlistSidebar
          wishlistOpen={localWishlistOpen}
          toggleWishlist={() => setLocalWishlistOpen(false)}
          backToAccount={() => {
            setLocalWishlistOpen(false);
            toggleSidebar?.();
          }}
        />
      )}

      <MyOrders open={ordersOpen} setOpen={setOrdersOpen} />
      <EditProfile
        open={profileOpen}
        setOpen={setProfileOpen}
        onProfileUpdate={handleProfileUpdate}
        isLoggedIn={isLoggedIn}
      />
      <SaveCards open={cardsOpen} setOpen={setCardsOpen} />
      <SaveAddress open={addressOpen} setOpen={setAddressOpen} />
    </>
  );
}
