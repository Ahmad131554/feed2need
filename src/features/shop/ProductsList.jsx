import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router";
import ProductCard from "./ProductCard";

const PRODUCTS_PER_PAGE = 8;

function ProductsList({
  fromHome = false,
  sortOption = "default",
  maxPrice = 10000,
  category = null,
  subCategory = null,
}) {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("shop_products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Failed to fetch products:", error);
    else setProducts(data);

    setLoading(false);
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE);
  };

  // Process filters and sorting
  let displayProducts = [...products];

  if (!fromHome) {
    // Apply price filter
    displayProducts = displayProducts.filter(
      (product) => product.price <= maxPrice,
    );

    // Apply category filter
    if (category) {
      displayProducts = displayProducts.filter(
        (product) => product.category === category,
      );
    }

    // Apply subcategory filter
    if (subCategory) {
      displayProducts = displayProducts.filter(
        (product) => product.sub_category === subCategory,
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "asc":
        displayProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "desc":
        displayProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-low-high":
        displayProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        displayProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
  }

  return (
    <section className="mb-8 py-8">
      <h3 className="mb-4 text-3xl font-bold text-gray-800">Shop Products</h3>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          {/* <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"> */}

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayProducts.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-gray-500">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                  alt="No results"
                  className="mb-4 h-24 w-24 opacity-60"
                />
                <p className="text-lg font-medium">
                  No products match your current filters.
                </p>
                <p className="text-sm text-gray-400">
                  Try adjusting your category or price range.
                </p>
              </div>
            ) : (
              displayProducts
                .slice(0, visibleCount)
                .map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))
            )}
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {fromHome ? (
              <button
                onClick={() => navigate("/shop")}
                className="font-medium text-green-700 hover:underline"
              >
                Shop all products →
              </button>
            ) : (
              visibleCount < displayProducts.length && (
                <button
                  onClick={handleLoadMore}
                  className="rounded-md bg-green-600 px-6 py-2 font-medium text-white transition hover:bg-green-700"
                >
                  Load More
                </button>
              )
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default ProductsList;
