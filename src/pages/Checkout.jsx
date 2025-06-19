import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../supabaseClient";
import OrderSummary from "../features/cart/OrderSummary";

const billingSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  zip_code: z.string().min(1),
});

function Checkout() {
  const [subtotal, setSubtotal] = useState(0);
  const [addressId, setAddressId] = useState(null);
  const formRef = useRef();

  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(billingSchema),
  });

  useEffect(() => {
    const loadCart = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("cart")
        .select("quantity, shop_products ( price )")
        .eq("customer_id", user.id);

      if (error || !data) {
        console.error("❌ Failed to fetch cart:", error?.message);
        return;
      }

      const total = data.reduce(
        (acc, item) => acc + item.quantity * item.shop_products.price,
        0,
      );

      setSubtotal(total);
    };

    const loadAddress = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existing } = await supabase
        .from("billing_address")
        .select("*")
        .eq("customer_id", user.id)
        .maybeSingle();

      if (existing) {
        const fields = [
          "first_name",
          "last_name",
          "phone",
          "email",
          "address",
          "city",
          "state",
          "zip_code",
        ];
        fields.forEach((field) => setValue(field, existing[field] || ""));
        setAddressId(existing.address_id);
      }
    };

    loadCart();
    loadAddress();
  }, [setValue]);

  const onSubmit = async (formData) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (addressId) {
      await supabase
        .from("billing_address")
        .update(formData)
        .eq("address_id", addressId);
    } else {
      await supabase.from("billing_address").insert({
        ...formData,
        customer_id: user.id,
        is_default: true,
      });
    }

    const { data: cartItems, error: cartErr } = await supabase
      .from("cart")
      .select("quantity, shop_products ( product_id, name, price )")
      .eq("customer_id", user.id);

    if (cartErr || !cartItems) {
      alert("Cart is empty or failed to load.");
      return;
    }

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.quantity * item.shop_products.price,
      0,
    );
    const total = subtotal + 200;

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: user.id,
        total_amount: total,
        status: "placed",
        order_date: new Date(),
      })
      .select("order_id")
      .single();

    if (orderError) {
      alert("Failed to place order.");
      return;
    }

    await supabase.from("order_status_history").insert({
      order_id: orderData.order_id,
      status: "placed",
    });

    const orderItems = cartItems.map((item) => ({
      order_id: orderData.order_id,
      product_id: item.shop_products.product_id,
      quantity: item.quantity,
      price: item.shop_products.price,
    }));

    await supabase.from("order_items").insert(orderItems);
    await supabase.from("cart").delete().eq("customer_id", user.id);

    // Convert PKR to USD — example: 1 USD = Rs. 280
    const EXCHANGE_RATE = 280;

    const response = await fetch(
      "https://ujpyhyxcvyvqeegzcdvj.functions.supabase.co/checkout-js",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_email: formData.email,
          items: cartItems.map((item) => ({
            name: item.shop_products.name,
            price: Math.round((item.shop_products.price / EXCHANGE_RATE) * 100), // USD cents
            quantity: item.quantity,
          })),
        }),
      },
    );

    const { url } = await response.json();

    if (url) {
      localStorage.setItem(
        "last_order_summary",
        JSON.stringify({
          order_id: orderData.order_id,
          total,
          item_count: totalItems,
          payment: "Stripe",
        }),
      );
      window.location.href = url;
    }
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Checkout</h2>
        <Link to="/cart">
          <button className="rounded-md bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700">
            ← Back to Cart
          </button>
        </Link>
      </div>

      <form
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
      >
        <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-2">
          <h3 className="mb-6 text-2xl font-semibold text-gray-800">
            Billing Details
          </h3>
          <div className="space-y-6">
            {/* All form fields (same as before) */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  {...register("first_name")}
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-3"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  {...register("last_name")}
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-3"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                {...register("phone")}
                type="text"
                className="w-full rounded-md border border-gray-300 p-3"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full rounded-md border border-gray-300 p-3"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                {...register("address")}
                type="text"
                className="w-full rounded-md border border-gray-300 p-3"
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  {...register("city")}
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-3"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  {...register("state")}
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-3"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                {...register("zip_code")}
                type="text"
                className="w-full rounded-md border border-gray-300 p-3"
              />
            </div>
          </div>
        </div>

        <OrderSummary
          subtotal={subtotal}
          nextPath="/placeOrder"
          onSubmitTrigger={() => formRef.current?.requestSubmit()}
        />
      </form>
    </main>
  );
}

export default Checkout;
