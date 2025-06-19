import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Login successful!");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-bold text-green-600">
        Login to Your Account
      </h2>
      <input
        className="mb-4 w-full rounded-lg border p-3"
        type="email"
        placeholder="Email address"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="mb-4 w-full rounded-lg border p-3"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
