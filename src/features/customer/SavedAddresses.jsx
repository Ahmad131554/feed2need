import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

function SavedAddresses() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [addressId, setAddressId] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existing } = await supabase
        .from("billing_address")
        .select("*")
        .eq("customer_id", user.id)
        .maybeSingle();

      if (existing) {
        setAddress(existing);
        setAddressId(existing.address_id);
      }

      setLoading(false);
    };

    fetchAddress();
  }, []);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setUpdating(true);
    const { error } = await supabase
      .from("billing_address")
      .update(address)
      .eq("address_id", addressId);

    setMessage(error ? "❌ Failed to update address" : "✅ Address updated");
    setUpdating(false);
  };

  if (loading) return <p className="p-6 text-gray-500">Loading address...</p>;

  if (!address) {
    return (
      <main className="p-8 text-center text-lg text-gray-600">
        You have not placed any order yet. Complete your first order to manage
        your saved address.
      </main>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Saved Address</h2>
      {message && <p className="mb-4 text-blue-600">{message}</p>}

      <form className="max-w-xl space-y-6">
        {/* Reuse fields from Checkout */}
        {[
          ["First Name", "first_name"],
          ["Last Name", "last_name"],
          ["Phone Number", "phone"],
          ["Email", "email"],
          ["Street Address", "address"],
          ["City", "city"],
          ["State / Province", "state"],
          ["Postal Code", "zip_code"],
        ].map(([label, key]) => (
          <div className="flex flex-col" key={key}>
            <label htmlFor={key} className="font-medium text-gray-700">
              {label}
            </label>
            <input
              type="text"
              name={key}
              value={address[key] || ""}
              onChange={handleChange}
              className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleSave}
          disabled={updating}
          className="mt-4 rounded bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700"
        >
          {updating ? "Saving..." : "Save Address"}
        </button>
      </form>
    </div>
  );
}

export default SavedAddresses;
