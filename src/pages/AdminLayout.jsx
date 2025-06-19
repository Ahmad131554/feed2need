import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router";
import DashboardLayout from "./DashboardLayout";

function AdminLayout() {
  const [isAllowed, setIsAllowed] = useState(null); // null = loading
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        navigate("/admin-auth");
        return;
      }

      const { data: userRow, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (roleError || !userRow || userRow.role !== "admin") {
        navigate("/");
        return;
      }

      setIsAllowed(true);
    };

    checkAdminAccess();
  }, [navigate]);

  if (isAllowed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg text-gray-700">
        Checking admin access...
      </div>
    );
  }

  return <DashboardLayout role="admin" />;
}

export default AdminLayout;
