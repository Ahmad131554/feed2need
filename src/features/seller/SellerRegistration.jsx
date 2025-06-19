import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiUpload } from "react-icons/fi";
import { supabase } from "../../supabaseClient";
import { NavLink, useNavigate } from "react-router";

// ────────────────────────────────────────────────────────────
// 1.  Validation schema
// ────────────────────────────────────────────────────────────
const schema = z.object({
  business_name: z
    .string()
    .min(4, "Business name must be at least 4 characters"),
  business_details: z
    .string()
    .min(5, "Description must be at least 5 characters"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  contact_no: z.string().min(11, "Contact number must be at least 11 digits"),
  city: z.string().min(3, "City must be at least 3 characters"),
  province: z.string().min(4, "Province must be at least 4 characters"),
  address: z.string().min(1, "Street address is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  bank_name: z.string().min(2, "Bank name must be at least 2 characters"),
  beneficiary_name: z
    .string()
    .min(2, "Beneficiary name must be at least 2 characters"),
  account_no: z.string().min(5, "Account number must be at least 5 digits"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the consent policy" }),
  }),
});

// ────────────────────────────────────────────────────────────
// 2.  Component
// ────────────────────────────────────────────────────────────
function SellerRegistration() {
  const [step, setStep] = useState(0);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  // ─────────── CHECK IF ALREADY REGISTERED ───────────
  useEffect(() => {
    (async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("seller_profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        navigate("/seller"); // already has profile
      }
    })();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please upload an image");
    if (file.size > 3 * 1024 * 1024) return alert("Image must be < 3 MB");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const next = async () => {
    const stepFields = [
      ["business_name", "business_details"],
      [
        "first_name",
        "last_name",
        "contact_no",
        "city",
        "province",
        "address",
        "postal_code",
      ],
      ["bank_name", "beneficiary_name", "account_no"],
      ["consent"],
    ][step];

    const valid = await trigger(stepFields);
    if (valid) setStep((s) => s + 1);
  };

  const back = () => setStep((s) => s - 1);

  const onSubmit = async (formData) => {
    if (!image) return alert("Please upload a business image");
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr || !user) throw new Error("Session expired. Log in again.");

      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `seller-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("seller-images")
        .upload(filePath, image, { cacheControl: "3600", upsert: false });

      if (uploadError)
        throw new Error(`Image upload failed: ${uploadError.message}`);

      const {
        data: { publicUrl },
      } = supabase.storage.from("seller-images").getPublicUrl(filePath);

      const profilePayload = {
        id: user.id,
        business_name: formData.business_name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        contact_no: formData.contact_no,
        city: formData.city,
        province: formData.province,
        address: formData.address,
        postal_code: parseInt(formData.postal_code, 10),
        business_details: formData.business_details,
        profile_picture: publicUrl,
      };

      const { error: profileErr } = await supabase
        .from("seller_profiles")
        .insert(profilePayload);

      if (profileErr)
        throw new Error(`Profile save failed: ${profileErr.message}`);

      const bankPayload = {
        seller_id: user.id,
        bank_name: formData.bank_name,
        beneficiary_name: formData.beneficiary_name,
        account_no: formData.account_no,
      };

      const { error: bankErr } = await supabase
        .from("seller_bank_accounts")
        .insert(bankPayload);

      if (bankErr) throw new Error(`Bank info save failed: ${bankErr.message}`);

      alert("Seller profile completed successfully!");
      reset();
      setImage(null);
      setImagePreview(null);
      navigate("/seller");
    } catch (err) {
      setSubmitError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const Label = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="text-lg font-medium text-gray-700">
      {children} <span className="text-red-500">*</span>
    </label>
  );

  const Step0 = () => (
    <>
      <div className="flex flex-col">
        <Label htmlFor="image-upload">Business Image</Label>
        <div className="mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={isSubmitting}
          />
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer items-center space-x-2 text-green-500"
          >
            <FiUpload size={24} />
            <span>{image ? "Change Image" : "Upload an Image (max 3 MB)"}</span>
          </label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 h-40 w-auto rounded-md object-contain"
            />
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <Label htmlFor="business_name">Business Name</Label>
        <input
          id="business_name"
          {...register("business_name")}
          type="text"
          placeholder="Enter business name"
          className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
          disabled={isSubmitting}
        />
        {errors.business_name && (
          <p className="text-sm text-red-600">{errors.business_name.message}</p>
        )}
      </div>
      <div className="flex flex-col">
        <Label htmlFor="business_details">General Details of Goods</Label>
        <textarea
          id="business_details"
          {...register("business_details")}
          placeholder="Describe goods"
          className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
          disabled={isSubmitting}
        />
        {errors.business_details && (
          <p className="text-sm text-red-600">
            {errors.business_details.message}
          </p>
        )}
      </div>
    </>
  );

  // const Step1 = () => (
  //   <>
  //     {/* Personal & Address Inputs */}
  //     {/* (Same as before, omitted here for brevity) */}
  //   </>
  // );

  // const Step2 = () => (
  //   <>
  //     {/* Bank Inputs */}
  //     {/* (Same as before, omitted here for brevity) */}
  //   </>
  // );

  const Step1 = () => (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* First / last name */}
        <div className="flex flex-col">
          <Label htmlFor="first_name">First Name</Label>
          <input
            id="first_name"
            {...register("first_name")}
            placeholder="Enter first name"
            className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
            disabled={isSubmitting}
          />
          {errors.first_name && (
            <p className="text-sm text-red-600">{errors.first_name.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <Label htmlFor="last_name">Last Name</Label>
          <input
            id="last_name"
            {...register("last_name")}
            placeholder="Enter last name"
            className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
            disabled={isSubmitting}
          />
          {errors.last_name && (
            <p className="text-sm text-red-600">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="flex flex-col">
        <Label htmlFor="contact_no">Contact Number</Label>
        <input
          id="contact_no"
          {...register("contact_no")}
          placeholder="Enter contact number"
          className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
          disabled={isSubmitting}
        />
        {errors.contact_no && (
          <p className="text-sm text-red-600">{errors.contact_no.message}</p>
        )}
      </div>

      {/* Address */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col">
          <Label htmlFor="city">City</Label>
          <input
            id="city"
            {...register("city")}
            placeholder="Enter city"
            className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
            disabled={isSubmitting}
          />
          {errors.city && (
            <p className="text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <Label htmlFor="province">Province</Label>
          <input
            id="province"
            {...register("province")}
            placeholder="Enter province"
            className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
            disabled={isSubmitting}
          />
          {errors.province && (
            <p className="text-sm text-red-600">{errors.province.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <Label htmlFor="address">Street Address</Label>
        <input
          id="address"
          {...register("address")}
          placeholder="Enter street address"
          className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
          disabled={isSubmitting}
        />
        {errors.address && (
          <p className="text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <Label htmlFor="postal_code">Postal Code</Label>
        <input
          id="postal_code"
          {...register("postal_code")}
          placeholder="Enter postal code"
          className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
          disabled={isSubmitting}
        />
        {errors.postal_code && (
          <p className="text-sm text-red-600">{errors.postal_code.message}</p>
        )}
      </div>
    </>
  );

  const Step2 = () => (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col">
          <Label htmlFor="bank_name">Bank Name</Label>
          <input
            id="bank_name"
            {...register("bank_name")}
            placeholder="Enter bank name"
            className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
            disabled={isSubmitting}
          />
          {errors.bank_name && (
            <p className="text-sm text-red-600">{errors.bank_name.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <Label htmlFor="beneficiary_name">Beneficiary Name</Label>
          <input
            id="beneficiary_name"
            {...register("beneficiary_name")}
            placeholder="Enter beneficiary name"
            className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
            disabled={isSubmitting}
          />
          {errors.beneficiary_name && (
            <p className="text-sm text-red-600">
              {errors.beneficiary_name.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <Label htmlFor="account_no">Account Number</Label>
        <input
          id="account_no"
          {...register("account_no")}
          placeholder="Enter account number"
          className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
          disabled={isSubmitting}
        />
        {errors.account_no && (
          <p className="text-sm text-red-600">{errors.account_no.message}</p>
        )}
      </div>
    </>
  );

  const Step3 = () => (
    <>
      <div className="flex items-start space-x-2">
        <input
          id="consent"
          type="checkbox"
          {...register("consent")}
          className="mt-1"
          disabled={isSubmitting}
        />
        <label htmlFor="consent" className="text-sm text-gray-700">
          I agree to the{" "}
          <NavLink
            to="/consent-policy"
            target="_blank"
            className="text-green-600 underline"
          >
            consent policy
          </NavLink>
        </label>
      </div>
      {errors.consent && (
        <p className="text-sm text-red-600">{errors.consent.message}</p>
      )}
    </>
  );

  const renderStep = () => {
    if (step === 0) return <Step0 />;
    if (step === 1) return <Step1 />;
    if (step === 2) return <Step2 />;
    return <Step3 />;
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-6 text-2xl font-semibold">Complete Seller Profile</h2>
      <p className="mb-6 text-lg text-gray-600">
        Step {step + 1} of 4 &nbsp;·&nbsp;
        {["Business", "Contact", "Bank", "Consent"][step]}
      </p>

      {submitError && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          Error: {submitError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg bg-white p-6 shadow-lg"
      >
        {renderStep()}

        <div className="mt-8 flex justify-between">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              disabled={isSubmitting}
              className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-300"
            >
              Back
            </button>
          )}

          {step < 3 && (
            <button
              type="button"
              onClick={next}
              disabled={isSubmitting}
              className="ml-auto rounded-lg bg-green-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-green-700"
            >
              Next
            </button>
          )}

          {step === 3 && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`ml-auto transform rounded-lg px-8 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 ${
                isSubmitting
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting ? "Processing…" : "Finish"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default SellerRegistration;
