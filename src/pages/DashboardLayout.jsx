import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import { Outlet } from "react-router";

function DashboardLayout({ role }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect /profile to /profile/orders for customer only
    if (role === "customer" && location.pathname === "/profile") {
      navigate("/profile/orders", { replace: true });
    }
  }, [location.pathname, navigate, role]);

  return (
    <div className="flex h-screen w-full">
      <aside className="h-full w-64 bg-teal-700 text-white">
        <DashboardSidebar role={role} />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader role={role} />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
