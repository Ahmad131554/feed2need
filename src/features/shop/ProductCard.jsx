import { Link } from "react-router";
import { addToCart } from "../../utils/cart";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { addToWishlist } from "../../utils/whishlist";
import toast from "react-hot-toast";

function ProductCard({ product, showWishlistIcon = true, onRemove }) {
  const [adding, setAdding] = useState(false);
  const [wishloading, setWishloading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addToCart(product, 1);
      toast.success("Item added to cart");
    } catch (err) {
      toast.error(`Failed to add item: ${err}`);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    setWishloading(true);
    try {
      await addToWishlist(product);
      toast.success("Added to wishlist");
    } catch (err) {
      toast.error(err.message || "Failed to add to wishlist");
    } finally {
      setWishloading(false);
    }
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <Link
      to={`/product/${product.product_id}`}
      className="group relative mx-auto w-full max-w-[18rem] transform rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-green-500 hover:shadow-lg"
    >
      {/* Wishlist Icon */}
      {showWishlistIcon && (
        <button
          onClick={handleWishlist}
          disabled={wishloading}
          className="absolute top-3 right-3 z-10 rounded-full bg-white p-2 text-gray-600 shadow-sm transition hover:text-green-600"
        >
          <FiHeart
            className={`h-5 w-5 ${wishloading ? "animate-pulse" : ""}`}
          />
        </button>
      )}

      <div className="w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-50 to-white p-4">
        <img
          src={product.image_url}
          alt={product.name}
          className="mx-auto h-32 object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-green-700">
          {product.name}
        </h3>

        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-medium">Price:</span> Rs. {product.price}
          </p>
          <p>
            <span className="font-medium">Stock:</span> {product.stock}{" "}
            available
          </p>
          <p>
            <span className="font-medium">Weight:</span> {product.unit_weight}{" "}
            {product.unit_label}
          </p>
        </div>

        <div className="mt-auto flex gap-2 pt-4">
          {onRemove && (
            <button
              onClick={handleRemove}
              className="flex-1 rounded-md bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-200"
            >
              Remove
            </button>
          )}
          <button
            onClick={handleAdd}
            disabled={adding}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium text-white transition ${
              adding
                ? "cursor-not-allowed bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
