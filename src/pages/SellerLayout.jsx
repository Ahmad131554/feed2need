import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { supabase } from "../supabaseClient";
import DashboardLayout from "./DashboardLayout";
import PendingApproval from "../ui/PendingApproval";

function SellerLayout() {
  const [isVerified, setIsVerified] = useState(null); // null = loading
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSeller = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return navigate("/seller-auth");

      const { data: profile } = await supabase
        .from("seller_profiles")
        .select("is_verified")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) return navigate("/seller-registration");

      setIsVerified(profile.is_verified);
    };

    checkSeller();
  }, [navigate]);

  if (isVerified === null)
    return <div className="p-6 text-center">Loading seller dashboard…</div>;

  // If not verified and not already on /seller/pending, redirect there
  if (!isVerified && location.pathname !== "/seller/pending") {
    navigate("/seller/pending");
    return null;
  }

  // If already on /seller/pending and not verified, show only that page (no sidebar/layout)
  if (!isVerified && location.pathname === "/seller/pending") {
    return <PendingApproval />;
  }

  return <DashboardLayout role="seller" />;
}

export default SellerLayout;
