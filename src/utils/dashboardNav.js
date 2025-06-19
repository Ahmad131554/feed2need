import {
  FiHome,
  FiBox,
  FiShoppingCart,
  FiUser,
  FiSettings,
  FiClipboard,
  FiHeart,
  FiUsers,
} from "react-icons/fi";

export const DASHBOARD_NAV = {
  seller: [
    { label: "Dashboard", icon: FiHome, path: "/seller" },
    { label: "Shop Products", icon: FiBox, path: "/seller/products" },
    { label: "Orders", icon: FiShoppingCart, path: "/seller/orders" },
    { label: "Add New Product", icon: FiUser, path: "/seller/newProduct" },
    { label: "Settings", icon: FiSettings, path: "/seller/accountSettings" },
  ],

  customer: [
    { label: "Order History", icon: FiClipboard, path: "/profile/orders" },
    { label: "Saved Addresses", icon: FiBox, path: "/profile/addresses" },
    { label: "Wishlist", icon: FiHeart, path: "/profile/wishlist" },
    { label: "Settings", icon: FiSettings, path: "/profile/settings" },
  ],

  admin: [
    { label: "Dashboard", icon: FiHome, path: "/admin" },
    { label: "Verify Sellers", icon: FiUsers, path: "/admin/verify-sellers" },
    { label: "Categories", icon: FiBox, path: "/admin/categories" },
    { label: "Orders", icon: FiClipboard, path: "/admin/orders" },
    // { label: "Reports", icon: FiBarChart2, path: "/admin/reports" },
  ],
};
