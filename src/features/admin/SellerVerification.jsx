import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

function SellerVerification() {
  const [loading, setLoading] = useState(true);
  const [sellers, setSellers] = useState([]);
  const [error, setError] = useState(null);

  const fetchUnverifiedSellers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("seller_profiles")
        .select("*")
        .eq("is_verified", false);

      if (error) throw error;
      setSellers(data || []);
      toast.success("Seller has been verified successfully!");
    } catch (err) {
      setError(err.message || "Failed to load seller data.");
    } finally {
      setLoading(false);
    }
  };

  const verifySeller = async (id) => {
    try {
      const { error } = await supabase
        .from("seller_profiles")
        .update({ is_verified: true })
        .eq("id", id);

      if (error) throw error;
      setSellers((prev) => prev.filter((seller) => seller.id !== id));
    } catch (err) {
      alert("Verification failed: " + err.message);
    }
  };

  useEffect(() => {
    fetchUnverifiedSellers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Pending Seller Verifications
      </h2>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && sellers.length === 0 && (
        <p className="text-gray-500">No pending seller verifications.</p>
      )}

      {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className="rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <img
              src={seller.profile_picture}
              alt={`${seller.business_name}`}
              className="mb-4 h-40 w-full rounded-md object-cover"
            />
            <h3 className="text-xl font-bold text-gray-800">
              {seller.business_name}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {seller.first_name} {seller.last_name}
            </p>
            <p className="text-sm text-gray-500">City: {seller.city}</p>
            <p className="text-sm text-gray-500">Province: {seller.province}</p>
            <p className="text-sm text-gray-500">
              Contact: {seller.contact_no}
            </p>
            <p className="mb-2 text-sm text-gray-500">
              Postal Code: {seller.postal_code}
            </p>
            <p className="text-sm text-gray-700 italic">
              "{seller.business_details}"
            </p>

            <button
              onClick={() => verifySeller(seller.id)}
              className="mt-4 flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
            >
              <FiCheck />
              Verify Seller
            </button>
          </div>
        ))}
      </div> */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-4 flex items-center gap-4">
              <img
                src={seller.profile_picture}
                alt={seller.business_name}
                className="h-14 w-14 rounded-full border border-gray-300 object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {seller.business_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {seller.first_name} {seller.last_name}
                </p>
              </div>
            </div>

            <div className="mb-4 space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">City:</span> {seller.city}
              </p>
              <p>
                <span className="font-medium">Province:</span> {seller.province}
              </p>
              <p>
                <span className="font-medium">Contact:</span>{" "}
                {seller.contact_no}
              </p>
              <p>
                <span className="font-medium">Postal:</span>{" "}
                {seller.postal_code}
              </p>
            </div>

            <p className="mb-4 text-sm text-gray-500 italic">
              "{seller.business_details}"
            </p>

            <button
              onClick={() => verifySeller(seller.id)}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
            >
              <FiCheck className="text-white" />
              Verify Seller
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerVerification;
