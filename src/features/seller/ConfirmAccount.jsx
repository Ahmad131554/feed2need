import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../supabaseClient";

function ConfirmAccount() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("confirming");

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setStatus("success");
        setTimeout(() => {
          navigate("/seller-registration");
        }, 1500);
      }
    });

    // If no session is restored after some time, show fallback
    setTimeout(() => {
      if (status === "confirming") setStatus("manual");
    }, 3000);

    return () => subscription.unsubscribe();
  }, [navigate, status]);

  return (
    <div className="flex h-screen items-center justify-center">
      {status === "confirming" && (
        <p className="text-lg text-gray-700">Confirming your account...</p>
      )}
      {status === "success" && (
        <p className="text-lg text-green-600">
          Account confirmed! Redirecting...
        </p>
      )}
      {status === "manual" && (
        <div className="text-center">
          <p className="mb-2 text-lg text-red-600">
            We couldn't confirm your session automatically.
          </p>
          <p className="text-gray-700">
            Please{" "}
            <a href="/seller-auth" className="text-blue-500 underline">
              log in
            </a>{" "}
            manually.
          </p>
        </div>
      )}
    </div>
  );
}

export default ConfirmAccount;
