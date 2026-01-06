import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

export default function SideBar({ filters, setFilters, counts, isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Sync filters from URL query params on load or URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category") || "";
    const priceFromUrl = params.get("price") || "";
    const sortFromUrl = params.get("sort") || "Featured";

    setFilters({
      category: categoryFromUrl,
      price: priceFromUrl,
      sort: sortFromUrl,
    });
  }, [location.search, setFilters]);

  const updateFilter = (newFilter) => {
    const updatedFilters = { ...filters, ...newFilter };
    setFilters(updatedFilters);

    const params = new URLSearchParams();

    if (updatedFilters.category) params.set("category", updatedFilters.category);
    if (updatedFilters.price) params.set("price", updatedFilters.price);
    if (updatedFilters.sort && updatedFilters.sort !== "Featured")
      params.set("sort", updatedFilters.sort);

    navigate({ search: params.toString() }, { replace: true });
  };

  const clearAll = () => {
    setFilters({ category: "", price: "", sort: "Featured" });
    navigate({ search: "" }, { replace: true });
  };

  const renderFilters = () => (
    <div className="text-blue-600">
      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Category</h4>
        {counts.categories.map((cat) => (
          <label key={cat.name} className="flex justify-between items-center mb-1 cursor-pointer">
            <div className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.name}
                onChange={() => updateFilter({ category: cat.name })}
                className="mr-2"
              />
              {cat.name}
            </div>
            <span className="text-gray-500 ml-2">({cat.count})</span>
          </label>
        ))}
        <button
          className="text-sm text-blue-600 mt-2 hover:underline"
          onClick={() => updateFilter({ category: "" })}
        >
          Clear
        </button>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Price</h4>
        <div className="flex flex-col gap-2">
          {counts.priceRanges.map((range) => (
            <button
              key={range.range}
              onClick={() => updateFilter({ price: range.range })}
              className={`flex justify-between px-3 py-1 rounded border text-sm transition-colors duration-200 ${filters.price === range.range
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <span>₹{range.range}</span>
              <span className="ml-4 text-gray-500">({range.count})</span>
            </button>
          ))}
        </div>
        <button
          className="text-sm text-blue-600 mt-3 hover:underline"
          onClick={() => updateFilter({ price: "" })}
        >
          Clear
        </button>
      </div>

      {/* Sort Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Sort By</h4>
        <div className="flex flex-wrap gap-2">
          {["Featured", "Price: Low to High", "Price: High to Low"].map((option) => (
            <button
              key={option}
              onClick={() => updateFilter({ sort: option })}
              className={`px-3 py-1 rounded border text-sm transition-colors duration-200 ${filters.sort === option
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Clear All Filters */}
      <div className="mt-6">
        <button
          onClick={clearAll}
          className="w-full text-left px-3 py-2 border rounded text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="text-blue-600">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r p-6 bg-white text-blue-500 hidden md:block fixed top-[72px] lg:top-[88px] left-0 h-full overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Filters</h3>
        {renderFilters()}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex md:hidden">
          <div className="absolute inset-0" onClick={toggleSidebar} />
          <div
            className="w-72 bg-white p-6 overflow-y-auto relative z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
              onClick={toggleSidebar}
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-lg font-bold mb-4">Filters</h3>
            {renderFilters()}
          </div>
        </div>
      )}
    </div>
  );
}
