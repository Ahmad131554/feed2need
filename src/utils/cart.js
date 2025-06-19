import { supabase } from "../supabaseClient";

// --- LOCAL STORAGE HELPERS ---

const LOCAL_CART_KEY = "guest_cart";

export const getGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveGuestCart = (cart) => {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
};

export const clearGuestCart = () => {
  localStorage.removeItem(LOCAL_CART_KEY);
};

// --- ADD TO CART HANDLER ---

export const addToCart = async (product, quantity = 1) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const cart = getGuestCart();
    const existing = cart.find((item) => item.productId === product.product_id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        productId: product.product_id,
        name: product.name,
        image: product.image_url,
        price: product.price,
        quantity,
        unit_weight: product.unit_weight,
        unit_label: product.unit_label,
      });
    }

    saveGuestCart(cart);
    return;
  }

  const { data: existingItem } = await supabase
    .from("cart")
    .select("id, quantity")
    .eq("customer_id", user.id)
    .eq("product_id", product.product_id)
    .maybeSingle();

  if (existingItem) {
    await supabase
      .from("cart")
      .update({ quantity: existingItem.quantity + quantity })
      .eq("id", existingItem.id);
  } else {
    await supabase.from("cart").insert({
      customer_id: user.id,
      product_id: product.product_id,
      quantity,
    });
  }
};

// --- UPDATE QUANTITY ---
export const updateQuantity = async (productId, quantity) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const cart = getGuestCart();
    const updated = cart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item,
    );
    saveGuestCart(updated);
    return true;
  }

  const { error } = await supabase
    .from("cart")
    .update({ quantity })
    .eq("product_id", productId)
    .eq("customer_id", user.id);

  return !error;
};

// --- REMOVE ITEM ---
export const removeFromCart = async (productId) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const cart = getGuestCart();
    const filtered = cart.filter((item) => item.productId !== productId);
    saveGuestCart(filtered);
    return true;
  }

  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("product_id", productId)
    .eq("customer_id", user.id);

  return !error;
};

// --- SYNC ON LOGIN ---
export const syncGuestCartToSupabase = async () => {
  const guestCart = getGuestCart();
  if (guestCart.length === 0) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  for (const item of guestCart) {
    const { data: existingItem } = await supabase
      .from("cart")
      .select("id, quantity")
      .eq("customer_id", user.id)
      .eq("product_id", item.productId)
      .maybeSingle();

    if (existingItem) {
      await supabase
        .from("cart")
        .update({ quantity: existingItem.quantity + item.quantity })
        .eq("id", existingItem.id);
    } else {
      await supabase.from("cart").insert({
        customer_id: user.id,
        product_id: item.productId,
        quantity: item.quantity,
      });
    }
  }

  clearGuestCart();
};
