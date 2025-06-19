import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../supabaseClient";
import { addToCart } from "../utils/cart";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("shop_products")
      .select("*")
      .eq("product_id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
    } else {
      setProduct(data);
    }
    setLoading(false);
  };

  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product, quantity);
      toast.success("Item added to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add item");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-600">Loading product...</div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center text-red-500">Product not found.</div>
    );
  }

  return (
    <main className="container mx-auto mt-6 flex min-h-screen items-start justify-center px-4 py-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Product Image */}
        <div className="flex items-center justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-[400px] max-w-full rounded-lg object-contain shadow-md"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-green-600">
              Rs. {product.price}
            </span>
            <span className="text-md text-gray-500">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              <span className="font-medium">Weight:</span> {product.unit_weight}{" "}
              {product.unit_label}
            </p>
          </div>

          {product.description && (
            <div className="pt-2 text-sm leading-relaxed text-gray-700">
              <h2 className="text-md mb-1 font-medium text-gray-800">
                Description:
              </h2>
              <p>{product.description}</p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <button
              className="rounded-md bg-gray-200 px-3 py-2 text-lg text-gray-700 hover:bg-green-500 hover:text-white"
              onClick={decreaseQuantity}
            >
              -
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              className="rounded-md bg-gray-200 px-3 py-2 text-lg text-gray-700 hover:bg-green-500 hover:text-white"
              onClick={increaseQuantity}
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <button
              className={`w-full rounded-md py-3 font-medium text-white transition ${
                adding
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={() => toast("Wishlist feature coming soon!")}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-3 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <FaHeart className="h-5 w-5 text-emerald-500" />
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
