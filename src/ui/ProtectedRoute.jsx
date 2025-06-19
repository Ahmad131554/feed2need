// import { Navigate, useLocation } from "react-router";
// import { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";

// function ProtectedRoute({ children }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const location = useLocation();

//   useEffect(() => {
//     const checkSession = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       setIsAuthenticated(!!session?.user);
//     };

//     checkSession();
//   }, []);

//   if (isAuthenticated === null) return <div>Loading...</div>;

//   return isAuthenticated ? (
//     children
//   ) : (
//     <Navigate to="/login" state={{ from: location }} replace />
//   );
// }

// export default ProtectedRoute;

import { Navigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking");
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!user) {
        setStatus("unauthenticated");
        return;
      }

      // Check if user is a CUSTOMER
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userError || !userData || userData.role !== "customer") {
        setStatus("unauthenticated");
        return;
      }

      // Now check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from("customer_profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError || !profile) {
        setStatus("unauthenticated");
        return;
      }

      setStatus("authenticated");
    };

    checkAccess();
  }, []);

  if (status === "checking") return <div>Checking session...</div>;
  if (status === "unauthenticated")
    return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
}

export default ProtectedRoute;
