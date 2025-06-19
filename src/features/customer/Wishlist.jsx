import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import ProductCard from "../shop/ProductCard";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("wishlist")
        .select(
          `
          wishlist_id,
          shop_products (
            product_id,
            name,
            image_url,
            price,
            stock,
            unit_weight,
            unit_label
          )
        `,
        )
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load wishlist");
      } else {
        setWishlist(data);
      }

      setLoading(false);
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (wishlist_id) => {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("wishlist_id", wishlist_id);
    if (error) {
      toast.error("Failed to remove");
    } else {
      setWishlist((prev) =>
        prev.filter((item) => item.wishlist_id !== wishlist_id),
      );
      toast.success("Removed from wishlist");
    }
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Your Wishlist
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : wishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <ProductCard
              key={item.wishlist_id}
              product={item.shop_products}
              showWishlistIcon={false}
              onRemove={() => handleRemove(item.wishlist_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
