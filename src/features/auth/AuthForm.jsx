import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router";

function AuthForm({ role = "customer", redirectTo = "/" }) {
  const isSeller = role === "seller";
  const isAdmin = role === "admin";

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [authError, setAuthError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setAuthError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);
    setSuccessMessage(null);

    try {
      if (isLogin) {
        // 🔐 LOGIN
        const result = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (result.error) throw result.error;

        const sessionUser = result.data.user;
        if (!sessionUser) throw new Error("User not found after login");

        // Ensure user has a role row
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("id", sessionUser.id)
          .maybeSingle();

        if (!existingUser) {
          await supabase.from("users").insert({ id: sessionUser.id, role });
        }

        if (isAdmin) {
          navigate("/admin");
        } else if (isSeller) {
          const { data: profile, error: profileErr } = await supabase
            .from("seller_profiles")
            .select("id")
            .eq("id", sessionUser.id)
            .maybeSingle();

          if (!profile && !profileErr) {
            navigate("/seller-registration");
          } else {
            navigate("/seller");
          }
        } else {
          // ✅ Customer
          const { data: customerProfile } = await supabase
            .from("customer_profiles")
            .select("id")
            .eq("id", sessionUser.id)
            .maybeSingle();

          if (!customerProfile) {
            await supabase.from("customer_profiles").insert({
              id: sessionUser.id,
              username: sessionUser.email.split("@")[0],
            });
          }

          navigate(redirectTo);
        }
      } else {
        // 📝 SIGNUP
        const result = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/confirm`,
          },
        });

        if (result.error) throw result.error;

        const user = result.data.user;
        if (user) {
          await supabase.from("users").insert({ id: user.id, role });
        }

        if (!result.data.session) {
          setSuccessMessage("Check your email to confirm your account.");
          return;
        }

        if (isAdmin) {
          navigate("/admin");
        } else if (isSeller) {
          navigate("/seller-registration");
        } else {
          navigate(redirectTo);
        }
      }
    } catch (err) {
      setAuthError(err.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Optional: map role to display title
  const roleLabel = isAdmin ? "Admin" : isSeller ? "Seller" : "Customer";

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          {isLogin ? `${roleLabel} Login` : `Create ${roleLabel} Account`}
        </h2>

        {authError && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {authError}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && role === "customer" && (
            <div>
              <label
                htmlFor="username"
                className="text-lg font-medium text-gray-700"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="mt-2 w-full rounded-md border border-gray-300 p-3"
                required
                disabled={isSubmitting}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="text-lg font-medium text-gray-700"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 w-full rounded-md border border-gray-300 p-3"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-lg font-medium text-gray-700"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="mt-2 w-full rounded-md border border-gray-300 p-3"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full transform rounded-lg px-6 py-3 font-semibold text-white transition ${
              isSubmitting
                ? "cursor-not-allowed bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        {role !== "admin" && (
          <p className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
            <button
              onClick={toggleMode}
              className="font-semibold text-green-600 underline hover:text-green-800"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
