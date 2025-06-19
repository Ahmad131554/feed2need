import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FiLogOut } from "react-icons/fi";
import { supabase } from "../../supabaseClient";

function SellerHeader() {
  const [sellerName, setSellerName] = useState("Seller");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerName = async () => {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (user && !userErr) {
        const { data: profile, error: profileErr } = await supabase
          .from("seller_profiles")
          .select("first_name")
          .eq("id", user.id)
          .single();

        if (!profileErr && profile?.first_name) {
          setSellerName(profile.first_name);
        }
      }
    };

    fetchSellerName();
  }, []);

  // ✅ Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // Go back to home after logout
  };

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 shadow-md">
      {/* Welcome Text */}
      <div className="text-xl font-semibold tracking-wide text-white">
        Welcome, {sellerName}
      </div>

      {/* Logout Button */}
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2 font-medium text-white transition hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:outline-none"
        >
          <FiLogOut className="text-lg" /> Logout
        </button>
      </div>
    </div>
  );
}

export default SellerHeader;
