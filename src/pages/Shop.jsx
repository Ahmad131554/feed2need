import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import ProductsList from "../features/shop/ProductsList";
import Sidebar from "../features/shop/Sidebar";

function Shop() {
  const [sortOption, setSortOption] = useState("default");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [openCategory, setOpenCategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handlePriceFilterChange = (e) => {
    setMaxPrice(Number(e.target.value));
  };

  const toggleCategoryDropdown = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto grid grid-cols-1 gap-4 px-4 lg:grid-cols-5">
        <aside className="border-r border-gray-200 pt-8 pb-8 lg:col-span-1">
          <Sidebar
            toggle={toggleCategoryDropdown}
            openCategory={openCategory}
            activeCategory={activeCategory}
            activeSubCategory={activeSubCategory}
            setActiveCategory={setActiveCategory}
            setActiveSubCategory={setActiveSubCategory}
          />
        </aside>

        <main className="px-4 pt-8 pb-8 lg:col-span-4">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Shop Grid</h3>
            <div className="mt-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="flex flex-wrap items-center space-x-3 text-sm">
                <label
                  htmlFor="price-range"
                  className="font-medium text-gray-700"
                >
                  Max Price:
                </label>
                <input
                  type="range"
                  id="price-range"
                  min="0"
                  max="10000"
                  step="100"
                  value={maxPrice}
                  onChange={handlePriceFilterChange}
                  className="w-56"
                />
                <span className="font-medium text-gray-600">
                  Up to Rs. {maxPrice}
                </span>
              </div>

              <div className="relative w-64 text-sm">
                <label
                  htmlFor="sort"
                  className="mb-1 block font-medium text-gray-700"
                >
                  Sort By:
                </label>
                <div className="relative">
                  <select
                    id="sort"
                    value={sortOption}
                    onChange={handleSortChange}
                    className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="asc">Name (A-Z)</option>
                    <option value="desc">Name (Z-A)</option>
                    <option value="price-low-high">Price (Low to High)</option>
                    <option value="price-high-low">Price (High to Low)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <FiChevronDown className="text-base text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(activeCategory || activeSubCategory) && (
            <div className="mb-6">
              <button
                onClick={() => {
                  setActiveCategory(null);
                  setActiveSubCategory(null);
                  setOpenCategory(null);
                }}
                className="inline-flex items-center rounded-md bg-green-100 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-200 hover:text-green-800"
              >
                Clear Filters
              </button>
            </div>
          )}

          <ProductsList
            sortOption={sortOption}
            maxPrice={maxPrice}
            category={activeCategory}
            subCategory={activeSubCategory}
          />
        </main>
      </div>
    </div>
  );
}

export default Shop;
