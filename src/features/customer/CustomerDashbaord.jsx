import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../supabaseClient";
import { FiClipboard, FiHeart, FiMapPin, FiLogOut } from "react-icons/fi";

function CustomerDashboard() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        navigate("/login");
        return;
      }

      setEmail(user.email);

      const { data, error: profileError } = await supabase
        .from("customer_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !data) {
        console.error(
          "❌ Profile not found or failed to load:",
          profileError?.message,
        );
        setProfile(null);
      } else {
        setProfile({ ...data, email: user.email });
      }

      setAuthChecked(true);
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (!authChecked) {
    return (
      <div className="py-16 text-center text-gray-600">Checking session...</div>
    );
  }

  if (!profile) {
    return (
      <main className="container mx-auto px-4 py-12 text-center text-gray-600">
        <p className="mb-4 text-lg">Your profile isn’t available.</p>
        <button
          onClick={() => navigate("/")}
          className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Back to Home
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-700">
          {getInitials(profile.username)}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome, {profile.username}
          </h2>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
        <DashboardButton
          label="View Order History"
          icon={<FiClipboard className="h-5 w-5" />}
          onClick={() => navigate("/profile/orders")}
          color="bg-green-50 text-green-700 hover:bg-green-100"
        />
        <DashboardButton
          label="Wishlist"
          icon={<FiHeart className="h-5 w-5" />}
          onClick={() => navigate("/wishlist")}
          color="bg-pink-50 text-pink-700 hover:bg-pink-100"
        />
        <DashboardButton
          label="Saved Addresses"
          icon={<FiMapPin className="h-5 w-5" />}
          onClick={() => navigate("/addresses")}
          color="bg-blue-50 text-blue-700 hover:bg-blue-100"
        />
        <DashboardButton
          label="Logout"
          icon={<FiLogOut className="h-5 w-5" />}
          onClick={handleLogout}
          color="bg-red-50 text-red-700 hover:bg-red-100"
        />
      </div>
    </main>
  );
}

function DashboardButton({ label, icon, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium shadow-sm transition ${color}`}
    >
      <span className="rounded-full bg-white p-2 shadow">{icon}</span>
      {label}
    </button>
  );
}

export default CustomerDashboard;
