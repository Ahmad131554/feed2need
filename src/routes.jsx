import { createBrowserRouter } from "react-router";

import AppLayout from "./ui/AppLayout";
import HomePage from "./pages/HomePage";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PlaceOrder from "./pages/PlaceOrder";
import OrderHistory from "./features/customer/OrderHistory";

import SellerRegistration from "./features/seller/SellerRegistration";
import SellerAccountSettings from "./features/seller/SellerAccountSettings";
import AddNewProduct from "./features/seller/AddNewProduct";
import ShopProducts from "./features/seller/ShopProducts";
import AllOrders from "./features/seller/AllOrders";
import PendingApproval from "./ui/PendingApproval";

import AdminDashboard from "./features/admin/AdminDashboard";
import SellerDashboard from "./features/seller/SellerDashbaord";
import AdminOrders from "./features/admin/AdminOrders";

import CustomerAuth from "./features/auth/CustomerAuth";
import SellerAuth from "./features/auth/SellerAuth";
import ConfirmAccount from "./features/seller/ConfirmAccount";

import ErrorPage from "./pages/ErrorPage";
import SellerLayout from "./pages/SellerLayout";
import CustomerLayout from "./pages/CustomerLayout";
import AdminLayout from "./pages/AdminLayout";
import Wishlist from "./features/customer/Wishlist";
import Categories from "./features/admin/Categories";
import SellerVerification from "./features/admin/SellerVerification";
import Settings from "./features/customer/CustomerAccountSettings";
import SavedAddresses from "./features/customer/SavedAddresses";
import OrderDetails from "./features/customer/OrderDetails";
import AdminAuth from "./features/auth/AdminAuth";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "shop", element: <Shop /> },
      { path: "product/:id", element: <ProductDetails /> },
      { path: "cart", element: <Cart /> },
      { path: "login", element: <CustomerAuth /> },
      { path: "checkout", element: <Checkout /> },
      { path: "placeOrder", element: <PlaceOrder /> },
      { path: "seller-auth", element: <SellerAuth /> },
      { path: "admin-auth", element: <AdminAuth /> },
      { path: "seller-registration", element: <SellerRegistration /> },
      { path: "confirm", element: <ConfirmAccount /> },
    ],
  },
  {
    element: <SellerLayout />,
    children: [
      { path: "seller", element: <SellerDashboard /> },
      { path: "seller/orders", element: <AllOrders /> },
      { path: "seller/products", element: <ShopProducts /> },
      { path: "seller/newProduct", element: <AddNewProduct /> },
      { path: "seller/accountSettings", element: <SellerAccountSettings /> },
      { path: "/seller/pending", element: <PendingApproval /> },
    ],
  },
  {
    element: <CustomerLayout />,
    children: [
      { path: "profile/orders", element: <OrderHistory /> },
      { path: "profile/orders/:id", element: <OrderDetails /> },
      { path: "profile/wishlist", element: <Wishlist /> },
      { path: "profile/addresses", element: <SavedAddresses /> },
      { path: "profile/settings", element: <Settings /> },
    ],
  },
  {
    element: <AdminLayout />,
    children: [
      { path: "admin", element: <AdminDashboard /> },
      { path: "admin/categories", element: <Categories /> },
      { path: "admin/verify-sellers", element: <SellerVerification /> },
      { path: "admin/orders", element: <AdminOrders /> },
    ],
  },
]);

export default router;
