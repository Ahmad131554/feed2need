import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch categories");
    } else {
      setCategories(data);
    }
    setLoading(false);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("categories")
        .update({
          category_name: categoryName,
          description,
        })
        .eq("category_id", editingId);

      if (error) {
        toast.error("Failed to update category");
      } else {
        toast.success("Category updated");
        resetForm();
        fetchCategories();
      }
    } else {
      const { error } = await supabase.from("categories").insert([
        {
          category_name: categoryName,
          description,
        },
      ]);

      if (error) {
        toast.error("Failed to add category");
      } else {
        toast.success("Category added");
        resetForm();
        fetchCategories();
      }
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.category_id);
    setCategoryName(category.category_name);
    setDescription(category.description || "");
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this category?");
    if (!confirm) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("category_id", id);

    if (error) {
      toast.error("Failed to delete category");
    } else {
      toast.success("Category deleted");
      fetchCategories();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setCategoryName("");
    setDescription("");
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Manage Categories
      </h2>

      {/* Form */}
      <form
        onSubmit={handleAddOrUpdate}
        className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
      >
        <input
          type="text"
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
          >
            {editingId ? "Update" : "Add Category"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg border border-gray-200 bg-white shadow-sm">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr key={category.category_id}>
                  <td className="px-4 py-2 text-sm">
                    {category.category_name}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {category.description || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {new Date(category.created_at).toLocaleDateString()}
                  </td>
                  <td className="space-x-2 px-4 py-2 text-center text-sm">
                    <button
                      onClick={() => handleEdit(category)}
                      className="rounded-md bg-blue-50 px-3 py-1 text-xs text-blue-700 hover:bg-blue-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.category_id)}
                      className="rounded-md bg-red-50 px-3 py-1 text-xs text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Categories;
