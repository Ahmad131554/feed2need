import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const AddNewProduct = () => {
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [unitWeight, setUnitWeight] = useState("");
  const [unitLabel, setUnitLabel] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories from Supabase
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("categories").select();
      if (!error) setCategories(data);
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr || !user) throw new Error("Please login again.");

      let imageUrl = null;

      if (!file) {
        throw new Error("Please provide valid image first");
      }

      if (file) {
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}.${ext}`;
        const filePath = fileName;
        // const filePath = `product-images/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from("product-images")
          .upload(filePath, file, { cacheControl: "3600", upsert: false });

        if (uploadErr)
          throw new Error(`Image upload failed: ${uploadErr.message}`);

        const {
          data: { publicUrl },
        } = supabase.storage.from("product-images").getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("shop_products").insert({
        seller_id: user.id,
        category_id: parseInt(categoryId),
        name: productName,
        description,
        price: parseFloat(price),
        unit_weight: parseFloat(unitWeight),
        unit_label: unitLabel,
        stock: parseInt(stock),
        image_url: imageUrl,
      });

      if (error) throw new Error(`Product save failed: ${error.message}`);

      alert("Product added successfully!");

      // Reset form
      setProductName("");
      setCategoryId("");
      setPrice("");
      setUnitWeight("");
      setUnitLabel("");
      setStock("");
      setDescription("");
      setFile(null);
    } catch (err) {
      alert(err.message || "Unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-6 text-2xl font-semibold">Add New Product</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg bg-white p-6 shadow-lg"
      >
        {/* Row 1: Product name and category */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col">
            <label
              htmlFor="productName"
              className="text-lg font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="categories"
              className="text-lg font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="categories"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Price, Unit Weight, Unit Label */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col">
            <label
              htmlFor="price"
              className="text-lg font-medium text-gray-700"
            >
              Price per Unit
            </label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
              placeholder="e.g. 500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="unitWeight"
              className="text-lg font-medium text-gray-700"
            >
              Unit Weight
            </label>
            <input
              id="unitWeight"
              type="number"
              value={unitWeight}
              onChange={(e) => setUnitWeight(e.target.value)}
              className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
              placeholder="e.g. 5 for 5kg"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="unitLabel"
              className="text-lg font-medium text-gray-700"
            >
              Unit Label
            </label>
            <input
              id="unitLabel"
              type="text"
              value={unitLabel}
              onChange={(e) => setUnitLabel(e.target.value)}
              className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
              placeholder="e.g. kg, litre, pack"
              required
            />
          </div>
        </div>

        {/* Row 3: Stock */}
        <div className="flex flex-col">
          <label htmlFor="stock" className="text-lg font-medium text-gray-700">
            Stock (No. of Units)
          </label>
          <input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
            placeholder="e.g. 20"
            required
          />
        </div>

        {/* Row 4: Description */}
        <div className="flex flex-col">
          <label
            htmlFor="description"
            className="text-lg font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter product description"
            rows="3"
            required
          />
        </div>

        {/* Row 5: Image upload */}
        <div className="flex flex-col">
          <label htmlFor="file" className="text-lg font-medium text-gray-700">
            Upload Image
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Submit button */}
        <div className="mt-6 flex justify-start">
          <button
            type="submit"
            disabled={isSubmitting}
            className="transform rounded-lg bg-green-600 px-8 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-green-700"
          >
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewProduct;
