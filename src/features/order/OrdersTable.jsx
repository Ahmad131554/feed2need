import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

function OrdersTable({ orders, showPagination = false, ordersPerPage = 5 }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [orderList, setOrderList] = useState(orders); // Local state to update UI

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = showPagination
    ? orderList.slice(startIndex, startIndex + ordersPerPage)
    : orderList;

  useEffect(() => {
    setOrderList(orders);
  }, [orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    // 1. Fetch current status from orders table
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("status")
      .eq("order_id", orderId)
      .single();

    if (fetchError) {
      alert("Failed to fetch order.");
      return;
    }

    const isSame = order.status === newStatus;

    // 2. Always update orders.status
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("order_id", orderId);

    if (updateError) {
      alert("Failed to update status.");
      return;
    }

    // 3. Insert into order_status_history only if status has changed
    if (!isSame) {
      await supabase.from("order_status_history").insert({
        order_id: orderId,
        status: newStatus,
      });
    }

    // 4. Update UI
    const updatedOrders = orderList.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o,
    );
    setOrderList(updatedOrders);
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-md">
        <thead className="bg-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {currentOrders.map((order, index) => (
            <tr key={index}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {order.id}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {order.productName}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {order.quantity}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{order.date}</td>
              <td className="px-6 py-4 text-sm text-gray-700">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="rounded border px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>

              <td className="px-6 py-4 text-sm">
                <button className="rounded bg-emerald-500 px-3 py-1 text-white hover:bg-emerald-600">
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPagination && (
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={`rounded px-4 py-2 text-sm ${
                currentPage === index + 1
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersTable;
