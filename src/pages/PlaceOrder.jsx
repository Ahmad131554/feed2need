import { Link } from "react-router";
import { useEffect, useState } from "react";

function PlaceOrder() {
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("last_order_summary");
    if (saved) {
      setOrderInfo(JSON.parse(saved));
    }
  }, []);

  if (!orderInfo) {
    return (
      <div className="py-16 text-center text-gray-600">Loading order...</div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-10 text-center shadow-lg">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="mb-4 text-3xl font-bold text-gray-800">
          Order Placed Successfully!
        </h2>
        <p className="mb-6 text-gray-600">
          Thank you for shopping with{" "}
          <span className="font-semibold text-green-600">FEED 2 NEED</span>.
          Your order is being processed.
        </p>

        <div className="mb-6 rounded-md bg-gray-50 p-6 text-left">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Order Summary
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span>{orderInfo.order_id}</span>
            </div>
            <div className="flex justify-between">
              <span>Items:</span>
              <span>{orderInfo.item_count} Products</span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-semibold text-green-600">
                Rs. {orderInfo.total}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment:</span>
              <span>{orderInfo.payment}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 md:flex-row">
          <Link to="/shop">
            <button className="w-full rounded-md bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 md:w-auto">
              Continue Shopping
            </button>
          </Link>
          <Link to="/profile/orders">
            <button className="w-full rounded-md border border-green-600 px-6 py-3 font-semibold text-green-600 transition hover:bg-green-50 md:w-auto">
              View My Orders
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default PlaceOrder;
