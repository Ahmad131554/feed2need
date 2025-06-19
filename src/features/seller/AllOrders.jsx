import { useEffect, useState } from "react";
import OrdersTable from "../order/OrdersTable";
import { supabase } from "../../supabaseClient";

function AllOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) {
        console.error("No user session found.");
        return;
      }

      const sellerId = user.id; // ✅ since seller_profiles.id === auth.users.id

      // 🧠 Step 2: Get order_items for this seller's products
      const { data, error } = await supabase
        .from("order_items")
        .select(
          `
          *,
          shop_products (
            name,
            seller_id
          ),
          orders (
            order_id,
            order_date,
            status
          )
        `,
        )
        .eq("shop_products.seller_id", sellerId);

      if (error) {
        console.error("Error fetching order items:", error.message);
        return;
      }

      // 🧾 Transform for the table (with null checks)
      const transformed = data
        .filter((item) => item.shop_products && item.orders)
        .map((item) => ({
          id: item.order_id,
          productName: item.shop_products.name,
          quantity: item.quantity,
          status: item.orders.status,
          date: item.orders.order_date?.split("T")[0] || "N/A",
        }));

      setOrders(transformed);
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="mb-6 text-3xl font-bold text-gray-800">Shop Orders</h2>
      <OrdersTable orders={orders} showPagination={true} ordersPerPage={6} />
    </div>
  );
}

export default AllOrders;
