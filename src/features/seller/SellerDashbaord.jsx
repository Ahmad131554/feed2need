import React from "react";
import { Link } from "react-router";
import OrdersTable from "../order/OrdersTable";
import { FaShoppingBag, FaChartLine, FaDollarSign } from "react-icons/fa";
import {
  IoHourglass,
  IoStopwatch,
  IoCloseCircleOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

const summaryData = [
  {
    title: "Total Products",
    value: 120,
    icon: <FaShoppingBag className="text-3xl text-white" />,
    bgColor: "bg-emerald-600",
  },
  {
    title: "Total Sales",
    value: 560,
    icon: <FaChartLine className="text-3xl text-white" />,
    bgColor: "bg-emerald-500",
  },
  {
    title: "Revenue",
    value: "PKR 1,245,000",
    icon: <FaDollarSign className="text-3xl text-white" />,
    bgColor: "bg-green-600",
  },
];

const orderStatusData = [
  {
    title: "Pending Orders",
    count: 15,
    icon: <IoHourglass className="text-3xl text-yellow-500" />,
    bgColor: "bg-yellow-100",
  },
  {
    title: "Processing Orders",
    count: 8,
    icon: <IoStopwatch className="text-3xl text-orange-500" />,
    bgColor: "bg-orange-100",
  },
  {
    title: "Cancelled Orders",
    count: 3,
    icon: <IoCloseCircleOutline className="text-3xl text-red-500" />,
    bgColor: "bg-red-100",
  },
  {
    title: "Completed Orders",
    count: 30,
    icon: <IoCheckmarkCircleOutline className="text-3xl text-green-500" />,
    bgColor: "bg-green-100",
  },
];

const recentOrders = [
  {
    id: "ORD001",
    productName: "Rice Bag",
    quantity: 1,
    status: "Shipped",
    date: "2025-03-15",
  },
  {
    id: "ORD002",
    productName: "Black Pepper Pack",
    quantity: 2,
    status: "Processing",
    date: "2025-03-16",
  },
  {
    id: "ORD003",
    productName: "Oranges Pack",
    quantity: 2,
    status: "Pending",
    date: "2025-03-16",
  },
];

function SellerDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="mb-6 text-3xl font-bold text-gray-800">
        Seller Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {summaryData.map((item, index) => (
          <div
            key={index}
            className={`flex items-center rounded-lg p-6 shadow-md ${item.bgColor}`}
          >
            <div className="mr-4">{item.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="text-lg font-bold text-white">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Overview */}
      <div className="mb-10">
        <h4 className="mb-4 text-2xl font-semibold text-gray-800">
          Order Status Overview
        </h4>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {orderStatusData.map((item, index) => (
            <div
              key={index}
              className={`flex items-center rounded-lg p-6 shadow-md ${item.bgColor}`}
            >
              <div className="mr-4">{item.icon}</div>
              <div>
                <h5 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h5>
                <p className="text-lg font-bold text-gray-700">{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h4 className="mb-4 text-2xl font-semibold text-gray-800">
          Recent Orders
        </h4>
        <OrdersTable orders={recentOrders} />

        <div className="mt-4 flex justify-end">
          <Link
            to="orders"
            className="rounded bg-emerald-500 px-5 py-2 text-white hover:bg-emerald-600"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
