import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { supabase } from "../supabaseClient";
import OrderSummary from "../features/cart/OrderSummary";
import CartItem from "../features/cart/CartItem";
import { FiShoppingCart } from "react-icons/fi";
import { toast } from "react-hot-toast";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUserId(null);
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const { data, error } = await supabase
      .from("cart")
      .select(
        `
        id,
        quantity,
        shop_products (
          product_id,
          name,
          price,
          image_url,
          unit_weight,
          unit_label
        )
      `,
      )
      .eq("customer_id", user.id);

    if (error) {
      console.error("Failed to fetch cart:", error.message);
    } else {
      const formatted = data.map((entry) => {
        const product = entry.shop_products;
        return {
          id: entry.id,
          productId: product.product_id,
          name: product.name,
          price: product.price,
          quantity: entry.quantity,
          image: product.image_url,
          unit_weight: product.unit_weight,
          unit_label: product.unit_label,
        };
      });
      setCartItems(formatted);
    }

    setLoading(false);
  };

  const clearCart = async () => {
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("customer_id", userId);
    if (error) {
      console.error("Failed to clear cart:", error.message);
      toast.error("Failed to clear cart.");
    } else {
      toast.success("Cart cleared successfully!");
      await loadCart();
    }
  };

  const handleQuantityChange = async (cartId, newQuantity) => {
    if (newQuantity < 1) return false;

    const { error } = await supabase
      .from("cart")
      .update({ quantity: newQuantity })
      .eq("id", cartId);

    if (error) {
      console.error("Failed to update quantity:", error.message);
      return false;
    } else {
      await loadCart();
      return true;
    }
  };

  const handleRemove = async (cartId) => {
    const { error } = await supabase.from("cart").delete().eq("id", cartId);
    if (error) {
      console.error("Failed to remove item:", error.message);
      return false;
    } else {
      await loadCart();
      return true;
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <p>Loading your cart...</p>
        </div>
      </main>
    );
  }

  if (!userId) return <Navigate to="/login" replace />;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-3xl font-bold text-gray-800">Shopping Cart</h2>
        <Link to="/shop">
          <button className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700">
            ← Continue Shopping
          </button>
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center text-gray-600">
          <FiShoppingCart className="mb-4 text-6xl text-green-500" />
          <p className="mb-2 text-xl font-medium">Your cart is empty</p>
          <p className="mb-6 text-sm text-gray-500">
            Looks like you haven’t added anything to your cart yet.
          </p>
          <Link to="/shop">
            <button className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
              Shop Now
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
            <div className="pt-2">
              <button
                onClick={clearCart}
                className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                🗑 Clear Cart
              </button>
            </div>
          </div>

          <div>
            <OrderSummary
              subtotal={subtotal}
              nextPath="/checkout"
              onSubmitTrigger={() => navigate("/checkout")}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default ShoppingCart;
