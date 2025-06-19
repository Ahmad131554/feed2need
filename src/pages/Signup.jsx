import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      const user = data.user;
      const table = role === "seller" ? "sellers" : "customer";

      await supabase.from(table).insert([
        {
          user_id: user.id,
          email: email,
          ...(role === "seller" ? { verified: false } : {}),
        },
      ]);

      alert("Signup successful! Check your email for confirmation.");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-bold text-green-600">
        Create Your Account
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
      <select
        className="mb-4 w-full rounded-lg border p-3"
        onChange={(e) => setRole(e.target.value)}
        value={role}
      >
        <option value="customer">Customer</option>
        <option value="seller">Seller</option>
      </select>
      <button
        className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
        onClick={handleSignup}
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </div>
  );
}
