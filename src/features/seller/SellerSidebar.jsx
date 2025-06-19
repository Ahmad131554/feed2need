import React from "react";
import { NavLink } from "react-router";
import {
  FiHome,
  FiBox,
  FiShoppingCart,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import Logo from "../../ui/Logo";

function SellerSidebar({ activeTab, handleTabChange }) {
  return (
    <div className="min-h-screen w-64 bg-teal-700 text-white">
      {/* Logo Section */}
      <div className="p-4">
        <Logo />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul>
          <li>
            <NavLink
              to="/seller"
              className={`flex items-center p-4 hover:bg-teal-800 ${activeTab === "dashboard" ? "bg-teal-800" : ""}`}
              onClick={() => handleTabChange("dashboard")}
            >
              <FiHome className="mr-3" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/seller/products"
              className={`flex items-center p-4 hover:bg-teal-800 ${activeTab === "products" ? "bg-teal-800" : ""}`}
              onClick={() => handleTabChange("products")}
            >
              <FiBox className="mr-3" />
              Shop Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/seller/orders"
              className={`flex items-center p-4 hover:bg-teal-800 ${activeTab === "orders" ? "bg-teal-800" : ""}`}
              onClick={() => handleTabChange("orders")}
            >
              <FiShoppingCart className="mr-3" />
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/seller/newProduct"
              className={`flex items-center p-4 hover:bg-teal-800 ${activeTab === "account" ? "bg-teal-800" : ""}`}
              onClick={() => handleTabChange("account")}
            >
              <FiUser className="mr-3" />
              Add New Product
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/seller/accountSettings"
              className={`flex items-center p-4 hover:bg-teal-800 ${activeTab === "settings" ? "bg-teal-800" : ""}`}
              onClick={() => handleTabChange("settings")}
            >
              <FiSettings className="mr-3" />
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default SellerSidebar;
