import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { supabase } from "../../supabaseClient";
import {
  FaCheckCircle,
  FaTruck,
  FaBoxOpen,
  FaTimesCircle,
} from "react-icons/fa";

const STATUS_FLOW = [
  { key: "placed", label: "Order Placed", icon: FaBoxOpen },
  { key: "processing", label: "Processing", icon: FaBoxOpen },
  { key: "shipped", label: "Shipped", icon: FaTruck },
  { key: "delivered", label: "Delivered", icon: FaCheckCircle },
  { key: "cancelled", label: "Cancelled", icon: FaTimesCircle },
];

function OrderDetails() {
  const { id: orderId } = useParams();
  const [timeline, setTimeline] = useState([]);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("order_id", orderId)
        .single();
      setOrder(orderData);

      const { data: statusData } = await supabase
        .from("order_status_history")
        .select("*")
        .eq("order_id", orderId)
        .order("changed_at", { ascending: true });
      setTimeline(statusData || []);

      const { data: itemData } = await supabase
        .from("order_items")
        .select("quantity, shop_products(name, price)")
        .eq("order_id", orderId);
      setItems(itemData || []);
    };

    fetchOrderDetails();
  }, [orderId]);

  const currentStatus = order?.status || null;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <Link to="/profile/orders">
        <button className="mb-6 inline-flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700">
          ← Back to Order History
        </button>
      </Link>

      <h2 className="mb-6 text-3xl font-bold text-gray-800">Order Tracking</h2>

      {order && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong className="text-gray-700">Order ID:</strong>{" "}
              {order.order_id}
            </p>
            <p>
              <strong className="text-gray-700">Status:</strong>{" "}
              <span className="capitalize">{order.status}</span>
            </p>
            <p>
              <strong className="text-gray-700">Date:</strong>{" "}
              {new Date(order.order_date).toLocaleDateString()}
            </p>
            <p>
              <strong className="text-gray-700">Total:</strong> Rs.
              {order.total_amount}
            </p>
          </div>
        </div>
      )}

      <h3 className="mb-4 text-xl font-semibold text-gray-800">Order Items</h3>
      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="font-medium text-gray-900">
                {item.shop_products.name}
              </p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <p className="font-semibold text-green-600">
              Rs.{item.shop_products.price}
            </p>
          </div>
        ))}
      </div>

      <h3 className="mb-4 text-xl font-semibold text-gray-800">
        Order Status Timeline
      </h3>
      <div className="overflow-x-auto">
        <div className="relative flex items-center gap-6 rounded-lg border border-gray-200 bg-white px-6 py-8 shadow">
          {STATUS_FLOW.map((step, index) => {
            const Icon = step.icon;
            const stepEntry = timeline.find((t) => t.status === step.key);
            const isCompleted = !!stepEntry;
            const isCurrent = step.key === currentStatus;

            return (
              <div
                key={step.key}
                className="relative flex flex-1 flex-col items-center text-center"
              >
                {/* Connector */}
                {index !== 0 && (
                  <div className="absolute top-6 -left-1/2 z-0 h-1 w-full bg-gray-300" />
                )}

                {/* Icon */}
                <div
                  className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 transition-all duration-300 ${
                    isCompleted
                      ? "border-green-500 bg-green-100 text-green-700"
                      : isCurrent
                        ? "scale-110 border-yellow-500 bg-yellow-100 text-yellow-600 shadow-lg"
                        : "border-gray-300 bg-gray-100 text-gray-400"
                  }`}
                >
                  <Icon />
                </div>

                {/* Label */}
                <p
                  className={`mt-2 text-sm font-medium ${
                    isCurrent
                      ? "text-yellow-600"
                      : isCompleted
                        ? "text-gray-800"
                        : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>

                {/* Timestamp */}
                {isCompleted && (
                  <p className="text-xs text-gray-400">
                    {new Date(stepEntry.changed_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
