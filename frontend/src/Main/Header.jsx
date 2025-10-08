// Header.jsx
import React, { useEffect, useState, useRef } from "react";
import { useCart } from "./Constant/AddToCart.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { IoPersonCircle } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { FaTimes, FaListUl } from "react-icons/fa";
import AddToCartSidebar from "./Constant/AddToCartSidebar.jsx";
import CategorySidebar from "./Constant/CategorySidebar.jsx";
import AccountSidebar from "./Constant/AccountSidebar.jsx";
import { getProducts } from "../api/api.js"; // ✅ Import API

export default function Header({
  setQuery,
  isLoggedIn,
  username,
  profilePic,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const [authState, setAuthState] = useState({
    isLoggedIn: isLoggedIn || false,
    username: username || "",
    profilePic: profilePic || "",
  });

  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const cartButtonRef = useRef(null);
  const searchDesktopRef = useRef(null);
  const searchMobileRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems = [] } = useCart() || {};

  const [scrolled, setScrolled] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [allProducts, setAllProducts] = useState([]); // ✅ Store all products

  // ✅ Restore login state on reload or page switch
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("username");
    const pic = localStorage.getItem("profilePic");
    if (token) {
      setAuthState({
        isLoggedIn: true,
        username: name || "User",
        profilePic: pic || "",
      });
    } else {
      setAuthState({ isLoggedIn: false, username: "", profilePic: "" });
    }
  }, [location.pathname]);

  // ✅ Fetch all products once on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setAllProducts(res.data); // assuming res.data is an array of products
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  // toggle helpers
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setCartOpen(false);
    setCategoryOpen(false);
    setAccountOpen(false);
  };
  const toggleCart = () => {
    setCartOpen((prev) => !prev);
    setMenuOpen(false);
    setCategoryOpen(false);
    setAccountOpen(false);
  };
  const toggleCategory = () => {
    setCategoryOpen((prev) => !prev);
    setMenuOpen(false);
    setCartOpen(false);
    setAccountOpen(false);
  };
  const toggleAccount = () => {
    setAccountOpen((prev) => !prev);
    setMenuOpen(false);
    setCartOpen(false);
    setCategoryOpen(false);
  };

  // Listen for footer sidebar toggle events
  useEffect(() => {
    const handler = (e) => {
      switch (e.detail) {
        case "account":
          setAccountOpen(true);
          break;
        case "cart":
          setCartOpen(true);
          break;
        case "wishlist":
          setAccountOpen(true);
          break;
        case "orders":
          setAccountOpen(true);
          break;
        default:
          break;
      }
    };
    window.addEventListener("toggleSidebar", handler);
    return () => window.removeEventListener("toggleSidebar", handler);
  }, []);

  // Debounced search
  useEffect(() => {
    const id = setTimeout(() => {
      if (!inputValue.trim()) {
        setFilteredResults([]);
        setShowResults(false);
      } else {
        const q = inputValue.toLowerCase();
        const results = allProducts.filter((it) =>
          it.name.toLowerCase().includes(q)
        );
        setFilteredResults(results);
        setShowResults(true);
      }
    }, 250);
    return () => clearTimeout(id);
  }, [inputValue, allProducts]);

  // scroll effects
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Document-level click + escape
  useEffect(() => {
    const onDocClick = (e) => {
      const t = e.target;
      if (
        menuOpen &&
        !(menuRef.current?.contains(t) || menuButtonRef.current?.contains(t))
      ) {
        setMenuOpen(false);
      }
      if (
        showResults &&
        !(
          searchDesktopRef.current?.contains(t) ||
          searchMobileRef.current?.contains(t)
        )
      ) {
        setShowResults(false);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setCartOpen(false);
        setCategoryOpen(false);
        setAccountOpen(false);
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, cartOpen, categoryOpen, accountOpen, showResults]);

  // handle search item click → redirect with CATEGORY
  const handleSearchClick = (item) => {
    setShowResults(false);
    setInputValue("");
    navigate(`/shop?category=${encodeURIComponent(item.category)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // handle category button click
  const handleCategoryClick = (category) => {
    setCategoryOpen(false);
    navigate(`/shop?category=${encodeURIComponent(category)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Handle logout properly everywhere
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePic");
    setAuthState({ isLoggedIn: false, username: "", profilePic: "" });
    if (onLogout) onLogout();
    navigate("/");
  };

  return (
    <div>
      {/* header */}
      <header
        className={`fixed w-full top-0 z-50 flex items-center justify-between px-2 md:px-8 lg:px-16 transition-all duration-300
        ${scrolled ? "bg-white shadow-md py-2 md:py-3" : "bg-white py-2 md:py-3"
          }`}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link to={"/"}>
            <img src="/assets/Aqualogo.png" alt="Logo" className="w-20 md:w-28 lg:w-32" />
          </Link>
        </div>

        {/* Mobile search (untouched) */}
        <div
          ref={searchMobileRef}
          className="relative flex md:hidden items-center flex-1 mx-3"
        >
          <input
            type="search"
            placeholder="Search..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setQuery?.(e.target.value);
            }}
            onFocus={() => inputValue && setShowResults(true)}
            className="w-full h-8 rounded-full text-black px-3 border border-gray-300 outline-none text-sm"
          />
          <button className="absolute right-0.5 bg-blue-500 w-8 h-7 rounded-full flex items-center justify-center">
            <img src="/assets/search.png" alt="Search" className="w-7" />
          </button>

          {showResults && filteredResults.length > 0 && (
            <div className="absolute top-10 left-0 w-full bg-white text-black rounded-xl max-h-64 overflow-y-auto shadow-lg border z-50">
              {filteredResults.map((item) => (
                <div
                  key={item._id || item.id}
                  className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSearchClick(item)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          ref={menuButtonRef}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Open menu"
          className="flex flex-col gap-1.5 bg-blue-600 p-2 rounded-md cursor-pointer md:hidden"
        >
          <span className="w-6 h-0.5 bg-white" />
          <span className="w-6 h-0.5 bg-white" />
          <span className="w-6 h-0.5 bg-white" />
        </button>

        {/* desktop nav */}
        <nav className="hidden md:flex md:flex-row md:space-x-6">
          {["Home", "Shop", "OrderTracking"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item}`}
              className={`font-semibold md:text-sm lg:text-lg xl:text-xl transition-colors duration-300
                ${scrolled
                  ? "text-blue-700 hover:text-orange-500"
                  : "text-blue-700 hover:text-blue-500"
                }`}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* desktop search (untouched) */}
        <div
          ref={searchDesktopRef}
          className="hidden md:flex relative items-center ml-4"
        >
          <input
            type="search"
            placeholder="Search Products"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setQuery?.(e.target.value);
            }}
            onFocus={() => inputValue && setShowResults(true)}
            className={`w-40 sm:w-56 lg:w-72 h-9 rounded-full px-3 border outline-none transition-all
              bg-blue-600 text-white placeholder-white border-white`}
          />
          <button className="absolute right-0.5 bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center">
            <img src="/assets/search.png" alt="Search" className="w-7 text-white" />
          </button>

          {showResults && filteredResults.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white text-black rounded-xl max-h-64 overflow-y-auto shadow-lg border z-50">
              {filteredResults.map((item) => (
                <div
                  key={item._id || item.id}
                  className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSearchClick(item)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* desktop icons */}
        <div className="hidden md:flex items-center gap-6 text-2xl">
          {/* Categories */}
          <div className="flex flex-col items-center">
            <button
              onClick={toggleCategory}
              aria-expanded={categoryOpen}
              className="cursor-pointer bg-blue-500 rounded-full p-2.5 border-white border-2"
              title="Categories"
            >
              <FaListUl className="text-white" />
            </button>
            <span className="text-xs font-semibold pt-2 text-blue-500">
              Categories
            </span>
          </div>

          {/* Cart */}
          <div className="flex flex-col items-center">
            <button
              ref={cartButtonRef}
              onClick={toggleCart}
              aria-expanded={cartOpen}
              className="relative cursor-pointer bg-blue-500 rounded-full p-2.5 border-white border-2"
              title="Cart"
            >
              <FiShoppingBag className="hover:text-red-600 text-white" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full px-1.5">
                  {cartItems.length}
                </span>
              )}
            </button>
            <span className="text-xs font-semibold pt-2 text-blue-500">
              Cart
            </span>
          </div>

          {/* Account */}
          <div className="flex flex-col items-center">
            <button
              onClick={toggleAccount}
              className="cursor-pointer hover:text-red-600 bg-blue-500 rounded-full p-2.5 border-white border-2"
              title="Account"
            >
              {authState.isLoggedIn && authState.profilePic ? (
                <img
                  src={authState.profilePic}
                  alt="Profile"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <IoPersonCircle className="text-white" />
              )}
            </button>
            <span className="text-xs font-semibold pt-2 text-blue-500">
              {authState.isLoggedIn
                ? authState.username || "User"
                : "Account"}
            </span>
          </div>
        </div>
      </header>

      {/* overlay */}
      {(menuOpen || cartOpen || categoryOpen || accountOpen) && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => {
            setMenuOpen(false);
            setCartOpen(false);
            setCategoryOpen(false);
            setAccountOpen(false);
            setShowResults(false);
          }}
        />
      )}

      {/* Mobile menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          className="absolute top-5 right-5 text-2xl text-blue-700"
          onClick={() => setMenuOpen(false)}
        >
          <FaTimes />
        </button>

        <div className="flex flex-col items-start gap-6 mt-16 px-6 text-lg font-semibold text-blue-700">
          {["Home", "Shop", "OrderTracking"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item}`}
              className="hover:text-black"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <AddToCartSidebar cartOpen={cartOpen} toggleCart={toggleCart} />

      {/* Category Sidebar */}
      <CategorySidebar
        isOpen={categoryOpen}
        toggleSidebar={toggleCategory}
        onCategoryClick={handleCategoryClick}
      />

      {/* Account Sidebar */}
      <AccountSidebar
        isOpen={accountOpen}
        toggleSidebar={toggleAccount}
        isLoggedIn={authState.isLoggedIn}
        username={authState.username}
        onLogout={handleLogout}
      />

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-md flex justify-around items-center py-3 md:hidden">
        <Link
          to="/"
          className="flex flex-col items-center text-blue-600 hover:text-red-600"
        >
          <AiFillHome className="w-7 h-7" />
          <span className="text-xs font-semibold">Home</span>
        </Link>

        <button
          className="flex flex-col items-center text-blue-600 hover:text-red-600"
          onClick={toggleCategory}
        >
          <FaListUl className="w-7 h-7" />
          <span className="text-xs font-semibold">Categories</span>
        </button>

        <button
          className="relative flex flex-col items-center text-blue-600 hover:text-red-600"
          onClick={toggleCart}
          ref={cartButtonRef}
          aria-label="Open cart"
        >
          <FiShoppingBag className="w-7 h-7" />
          {cartItems.length > 0 && (
            <span className="absolute top-0 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5">
              {cartItems.length}
            </span>
          )}
          <span className="text-xs font-semibold">Cart</span>
        </button>

        <button
          className="flex flex-col items-center text-blue-600 hover:text-red-600"
          onClick={toggleAccount}
        >
          {authState.isLoggedIn && authState.profilePic ? (
            <img
              src={authState.profilePic}
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <IoPersonCircle className="w-7 h-7" />
          )}
          <span className="text-xs font-semibold pt-1 text-blue-500">
            {authState.isLoggedIn
              ? authState.username || "User"
              : "Account"}
          </span>
        </button>
      </div>
    </div>
  );
}
