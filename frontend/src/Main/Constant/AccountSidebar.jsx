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
  isLoggedIn = false,
  onLogout = () => {},
  onProfileChange = (updatedUser) => {}, // parent can pass handler
}) {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Local states
  const [localWishlistOpen, setLocalWishlistOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cardsOpen, setCardsOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);

  const [currentProfilePic, setCurrentProfilePic] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(username);

  // ✅ Helper to correctly resolve image URLs
  const resolveProfilePic = (pic) => {
    if (!pic) return null;
    if (pic.startsWith("data:")) return pic; // base64 image
    if (pic.startsWith("http")) return pic; // absolute URL
    if (pic.startsWith("/uploads")) return `${baseURL}${pic}`;
    if (pic.startsWith("uploads")) return `${baseURL}/${pic}`;
    return `${baseURL}/uploads/${pic}`;
  };

  // ✅ Load user info from localStorage on mount and username change
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const u = JSON.parse(user);
        if (u.fullName) setCurrentUsername(u.fullName);
        if (u.profilePic) setCurrentProfilePic(resolveProfilePic(u.profilePic));
      } catch (err) {
        console.error("❌ Failed to parse user data:", err);
      }
    } else {
      setCurrentUsername(username);
      setCurrentProfilePic(null);
    }
  }, [username]);

  // ✅ Handle updates when EditProfile saves
  const handleProfileUpdate = (data) => {
    if (!data) return;

    const updatedUsername = data.fullName || currentUsername;
    const updatedProfilePic = resolveProfilePic(data.profilePic) || currentProfilePic;

    setCurrentUsername(updatedUsername);
    setCurrentProfilePic(updatedProfilePic);

    // ✅ Merge and save updated data to localStorage
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const mergedUser = {
        ...savedUser,
        fullName: updatedUsername,
        profilePic: data.profilePic, // store raw path/base64 (not resolved)
      };
      localStorage.setItem("user", JSON.stringify(mergedUser));
    } catch (err) {
      console.error("❌ Failed to save user:", err);
    }

    // Notify parent if needed
    onProfileChange(data);
  };

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
        {
          id: 2,
          label: "Wishlist",
          icon: <FaHeart />,
          onClick: () => setLocalWishlistOpen(true),
        },
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
    : [];

  return (
    <>
      {/* MAIN ACCOUNT SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          className="absolute top-5 right-5 text-2xl text-blue-700"
          onClick={(e) => {
            e.stopPropagation();
            toggleSidebar?.();
          }}
        >
          <FaTimes />
        </button>

        {/* PROFILE HEADER */}
        <div className="flex items-center gap-3 px-6 mt-12">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {currentProfilePic ? (
              <img
                src={currentProfilePic}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                }}
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

        {/* MENU LIST */}
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

          {/* LOGIN / LOGOUT BUTTON */}
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

        {/* RECENTLY VIEWED */}
        <div className="mt-10 px-6">
          <h3 className="text-md font-bold text-blue-600 mb-3">Recently Viewed</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <p className="text-sm text-gray-500">No recent products</p>
          </div>
        </div>
      </div>

      {/* OTHER SUB SIDEBARS */}
      {!toggleSidebar && (
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
      />
      <SaveCards open={cardsOpen} setOpen={setCardsOpen} />
      <SaveAddress open={addressOpen} setOpen={setAddressOpen} />
    </>
  );
}
