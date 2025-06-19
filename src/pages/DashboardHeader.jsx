import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FiLogOut } from "react-icons/fi";
import { supabase } from "../supabaseClient";

function DashboardHeader({ role }) {
  const [name, setName] = useState(role);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchName = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (!user || error) return;

      const table = role === "seller" ? "seller_profiles" : "customer_profiles";
      const column = role === "seller" ? "first_name" : "username";

      try {
        const { data, error: profileError } = await supabase
          .from(table)
          .select(column)
          .eq("id", user.id)
          .single();

        if (!profileError && data?.[column]) {
          setName(data[column]);
        }
      } catch (err) {
        console.warn("Failed to fetch dashboard name:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchName();
  }, [role]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 shadow-md">
      <div className="text-xl font-semibold tracking-wide text-white">
        {loading ? "Loading..." : `Welcome, ${name}`}
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2 font-medium text-white transition hover:bg-emerald-600"
      >
        <FiLogOut /> Logout
      </button>
    </div>
  );
}

export default DashboardHeader;
