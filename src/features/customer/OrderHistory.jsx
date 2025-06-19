import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrdersWithItems = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Unable to fetch user.");
        console.error(userError);
        setLoading(false);
        return;
      }

      // Step 1: Get user's orders
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (orderError) {
        setError("Unable to fetch orders.");
        console.error(orderError);
        setLoading(false);
        return;
      }

      // Step 2: Get all order items for those orders
      const orderIds = orderData.map((order) => order.order_id);

      const { data: orderItems, error: itemError } = await supabase
        .from("order_items")
        .select("order_id")
        .in("order_id", orderIds);

      if (itemError) {
        console.error(itemError);
        setError("Failed to fetch order item counts.");
        setLoading(false);
        return;
      }

      // Step 3: Count items per order
      const itemCounts = orderItems.reduce((acc, item) => {
        acc[item.order_id] = (acc[item.order_id] || 0) + 1;
        return acc;
      }, {});

      // Step 4: Merge item count into order objects
      const merged = orderData.map((order) => ({
        ...order,
        itemCount: itemCounts[order.order_id] || 0,
      }));

      setOrders(merged);
      setLoading(false);
    };

    fetchOrdersWithItems();
  }, []);

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Order History
      </h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && orders.length === 0 && !error && (
        <p className="text-gray-500">No orders found.</p>
      )}

      {!loading && orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg border border-gray-200 bg-white">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Order ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Items
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Total
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    #{order.order_id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.itemCount} item(s)
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    Rs.{order.total_amount?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link to={`/profile/orders/${order.order_id}`}>
                      <button className="text-blue-600 underline hover:text-blue-800">
                        Track
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
