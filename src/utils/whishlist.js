// utils/wishlist.js
import { supabase } from "../supabaseClient";

export const addToWishlist = async (product) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("Not logged in");

  // Check for existing entry
  const { data: existing } = await supabase
    .from("wishlist")
    .select("wishlist_id")
    .eq("customer_id", user.id)
    .eq("product_id", product.product_id)
    .maybeSingle();

  if (existing) throw new Error("Already in wishlist");

  // Insert new entry
  const { error } = await supabase.from("wishlist").insert({
    customer_id: user.id,
    product_id: product.product_id,
  });

  if (error) throw error;
};
