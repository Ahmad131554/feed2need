import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FiClipboard,
  FiUsers,
  FiShoppingBag,
  FiUserCheck,
  FiPackage,
  FiFolder,
} from "react-icons/fi";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats] = useState({
    orders: 1240,
    customers: 358,
    products: 420,
    sellers: 26,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome to the Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Manage operations and monitor the platform’s performance.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Orders"
          value={stats.orders}
          icon={<FiPackage className="h-5 w-5" />}
        />
        <StatCard
          label="Customers"
          value={stats.customers}
          icon={<FiUsers className="h-5 w-5" />}
        />
        <StatCard
          label="Products"
          value={stats.products}
          icon={<FiShoppingBag className="h-5 w-5" />}
        />
        <StatCard
          label="Sellers"
          value={stats.sellers}
          icon={<FiUserCheck className="h-5 w-5" />}
        />
      </div>

      {/* Quick Access Buttons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickAction
          label="View Orders"
          icon={<FiClipboard className="h-5 w-5" />}
          onClick={() => navigate("/admin/orders")}
          color="bg-blue-50 text-blue-700 hover:bg-blue-100"
        />
        <QuickAction
          label="Manage Categories"
          icon={<FiFolder className="h-5 w-5" />}
          onClick={() => navigate("/admin/categories")}
          color="bg-green-50 text-green-700 hover:bg-green-100"
        />
        <QuickAction
          label="Verify Sellers"
          icon={<FiUserCheck className="h-5 w-5" />}
          onClick={() => navigate("/admin/verify-sellers")}
          color="bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
        />
      </div>
    </main>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
        {icon}
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-800">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function QuickAction({ label, icon, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-4 py-4 text-sm font-medium shadow-sm transition ${color}`}
    >
      <span className="rounded-full bg-white p-2 shadow">{icon}</span>
      {label}
    </button>
  );
}

export default AdminDashboard;
