import AuthForm from "./AuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../supabaseClient";
import { syncGuestCartToSupabase } from "../../utils/cart";

function CustomerAuth() {
  const navigate = useNavigate();
  const redirectTo = "/profile/orders";

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // 🔁 Sync guest cart to Supabase after login
        await syncGuestCartToSupabase();
        navigate(redirectTo, { replace: true });
      }
    };

    checkSession();
  }, [navigate, redirectTo]);

  return <AuthForm role="customer" redirectTo={redirectTo} />;
}

export default CustomerAuth;
