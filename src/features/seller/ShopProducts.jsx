import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router";

function ShopProducts() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const productsPerPage = 6;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr || !user) {
        console.error("Auth error", userErr);
        return;
      }

      const { data, error } = await supabase
        .from("shop_products")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch products", error);
      } else {
        setProducts(data);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddNew = () => navigate("/seller/newProduct");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="mb-8 text-3xl font-bold text-gray-800">My Products</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven’t added any products yet.
        </p>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentProducts.map((product) => (
              <div
                key={product.product_id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-40 w-full rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {product.unit_weight} {product.unit_label}
                </p>
                <p className="mt-1 font-bold text-emerald-600">
                  Rs. {product.price}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Stock: {product.stock}
                </p>

                <div className="mt-4 flex justify-between">
                  <button className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
                    Edit
                  </button>
                  <button className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index + 1)}
                  className={`rounded px-4 py-2 text-sm font-medium transition ${
                    currentPage === index + 1
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add New Product Button */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={handleAddNew}
          className="rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 px-8 py-3 text-lg font-semibold text-white shadow-md transition hover:from-emerald-600 hover:to-green-600"
        >
          Add New Product
        </button>
      </div>
    </div>
  );
}

export default ShopProducts;
