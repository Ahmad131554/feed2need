import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";

function Settings() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [passwordChange, setPasswordChange] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        navigate("/login");
        return;
      }

      const { data, error: profileError } = await supabase
        .from("customer_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !data) {
        setMessage("Failed to load profile.");
        return;
      }

      setProfile({ ...data, email: user.email });
      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setUpdating(true);
    const { username } = profile;

    const { error } = await supabase
      .from("customer_profiles")
      .update({ username })
      .eq("id", profile.id);

    setUpdating(false);

    if (error) {
      toast.error("Failed to update profile.");
    } else {
      toast.success("Profile updated successfully.");
    }
  };

  const handlePasswordChange = async () => {
    const { new: newPass, confirm } = passwordChange;
    if (newPass !== confirm) {
      toast.error("New passwords do not match.");
      return;
    }

    setChangingPassword(true);

    const { error } = await supabase.auth.updateUser({ password: newPass });

    setChangingPassword(false);

    if (error) {
      toast.error("Failed to change password.");
    } else {
      toast.success("Password changed successfully.");
    }
  };

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (!confirmed) return;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Failed to retrieve user info.");
      return;
    }

    // 1. Remove from customer_profiles
    const { error: profileDeleteError } = await supabase
      .from("customer_profiles")
      .delete()
      .eq("id", user.id);

    if (profileDeleteError) {
      toast.error("Failed to delete user profile.");
      return;
    }

    // 2. Log the user out
    await supabase.auth.signOut();

    toast.success("Account deleted successfully.");
    navigate("/login");
  }

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Account Settings
      </h2>
      {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

      <form className="space-y-10">
        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Personal Info</h3>
          <div className="flex flex-col">
            <label htmlFor="username" className="font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="username"
              name="username"
              value={profile.username || ""}
              onChange={handleChange}
              className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="font-medium text-gray-700">
              Email Address (cannot be changed)
            </label>
            <input
              id="email"
              type="email"
              value={profile.email || ""}
              readOnly
              disabled
              className="mt-2 rounded-md border border-gray-200 bg-gray-100 p-3 text-gray-500"
            />
          </div>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={updating}
            className="mt-4 transform rounded-lg bg-green-600 px-8 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-green-700"
          >
            {updating ? "Saving..." : "Update Info"}
          </button>
        </div>

        {/* Change Password */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Change Password
          </h3>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
              onChange={(e) =>
                setPasswordChange({
                  ...passwordChange,
                  current: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
              onChange={(e) =>
                setPasswordChange({ ...passwordChange, new: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
              onChange={(e) =>
                setPasswordChange({
                  ...passwordChange,
                  confirm: e.target.value,
                })
              }
            />
          </div>
          <button
            type="button"
            onClick={handlePasswordChange}
            className="mt-4 transform rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
          >
            {changingPassword ? "Updating..." : "Change Password"}
          </button>
        </div>

        {/* Manage Addresses */}
        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-700">
            Addresses
          </h3>
          <button
            onClick={() => navigate("/profile/addresses")}
            className="rounded-md border border-gray-400 px-5 py-2 text-gray-800 hover:bg-gray-100"
          >
            Manage Saved Addresses
          </button>
        </div>

        {/* Danger Zone */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
          <button
            className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            onClick={handleDeleteAccount}
          >
            Delete My Account
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
