import React, { useState, useMemo, useEffect } from "react";
import Header from "../Main/Header.jsx";
import SideBar from "../Components/Shop/SideBar.jsx";
import Products from "../Components/Shop/Products.jsx";
import { FaTh, FaList, FaFilter } from "react-icons/fa";
import data from "../Data/ProductsData.jsx";

export default function Shop() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    price: "",
    sort: "Featured",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const normalizeCategory = (cat) => {
    if (!cat) return "";
    const map = {
      hunt: "hunt",
      fish: "fish",
      tank: "tank",
      decoration: "decoration",
      food: "food",
      medicine: "medicine",
      coral: "coral",
    };
    return map[cat.toLowerCase().trim()] || cat.toLowerCase().trim();
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, query]);

  const filteredProducts = useMemo(() => {
    let list = [...data];
    if (filters.category) {
      list = list.filter(
        (p) =>
          normalizeCategory(p.category) === normalizeCategory(filters.category)
      );
    }
    if (filters.price) {
      const [min, max] = filters.price.split("-").map(Number);
      list = list.filter(
        (p) => Number(p.price) >= min && Number(p.price) <= max
      );
    }
    if (query) {
      list = list.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (filters.sort === "Price: Low to High") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (filters.sort === "Price: High to Low") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    }
    return list;
  }, [filters, query]);

  const counts = useMemo(() => {
    let baseList = [...data];
    if (query) {
      baseList = baseList.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    let forCategoryCounts = [...baseList];
    if (filters.price) {
      const [min, max] = filters.price.split("-").map(Number);
      forCategoryCounts = forCategoryCounts.filter(
        (p) => Number(p.price) >= min && Number(p.price) <= max
      );
    }

    let forPriceCounts = [...baseList];
    if (filters.category) {
      forPriceCounts = forPriceCounts.filter(
        (p) =>
          normalizeCategory(p.category) === normalizeCategory(filters.category)
      );
    }

    const categories = [
      "Hunt",
      "Fish",
      "Tank",
      "Decoration",
      "Food",
      "Medicine",
      "Coral",
    ].map((cat) => ({
      name: cat,
      count: forCategoryCounts.filter(
        (p) => normalizeCategory(p.category) === normalizeCategory(cat)
      ).length,
    }));

    const priceRanges = [
      "19-49",
      "50-149",
      "150-499",
      "500-999",
      "1000-1299",
    ].map((range) => {
      const [min, max] = range.split("-").map(Number);
      return {
        range,
        count: forPriceCounts.filter(
          (p) => Number(p.price) >= min && Number(p.price) <= max
        ).length,
      };
    });

    return { categories, priceRanges };
  }, [filters.category, filters.price, query]);

  const productsPerPage = 50;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const firstResult =
    filteredProducts.length === 0 ? 0 : indexOfFirstProduct + 1;
  const lastResult = Math.min(indexOfLastProduct, filteredProducts.length);

  const productsKey = `${filters.category}|${filters.price}|${filters.sort}|${query}|${currentPage}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header query={query} setQuery={setQuery} />

      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 md:px-6 py-4 border-b text-blue-500 bg-gray-50 fixed top-[50px] md:top-[92px] md:left-[255px] lg:top-[90px] lg:py-4 left-0 right-0 z-40">
        <div className="flex items-center gap-3">
          <div className="text-gray-600 text-sm hidden sm:block">
            Home <span className="mx-2">›</span>{" "}
            <span className="font-semibold">Shop</span>
          </div>
          <button
            className="md:hidden p-2 border rounded text-gray-600 hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            <FaFilter />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded ${
                view === "grid"
                  ? "bg-black text-white"
                  : "bg-white border text-gray-600"
              }`}
            >
              <FaTh />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded ${
                view === "list"
                  ? "bg-black text-white"
                  : "bg-white border text-gray-600"
              }`}
            >
              <FaList />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 text-xs border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-xs font-medium">
              {currentPage}/{totalPages || 1}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              className="px-2 py-1 text-xs border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="text-gray-500 text-xs sm:text-sm hidden md:block">
          {firstResult}-{lastResult} of {filteredProducts.length}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 mt-[120px] lg:mt-[140px]">
        <SideBar
          filters={filters}
          setFilters={setFilters}
          counts={counts}
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <main className="flex-1 p-4 md:p-6 md:ml-64">
          <Products key={productsKey} products={currentProducts} view={view} />
        </main>
      </div>
    </div>
  );
}
