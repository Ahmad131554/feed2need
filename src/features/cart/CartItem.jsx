import { useState } from "react";
import toast from "react-hot-toast";

function CartItem({ item, onQuantityChange, onRemove }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState(null);

  const handleRemove = async () => {
    setIsRemoving(true);
    setError(null);
    try {
      const success = await onRemove(item.id);
      if (success) toast.success("Item removed from cart");
      else setError("❌ Failed to remove item. Try again.");
    } catch (err) {
      setError(`❌ Unexpected error... ${err}`);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleQuantityChange = async (newQty) => {
    if (newQty < 1) return;
    const success = await onQuantityChange(item.id, newQty);
    if (!success) toast.error("Failed to update quantity");
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <img
            src={item.image}
            alt={item.name}
            className="h-16 w-16 rounded-md object-cover"
          />
          <div>
            <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
            <p className="text-sm text-gray-500">Rs. {item.price}</p>
            <p className="text-xs text-gray-400">
              {item.unit_weight} {item.unit_label}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-md border px-2">
            <button
              className="px-2 text-lg font-bold text-gray-600 hover:text-green-600"
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              -
            </button>
            <span className="mx-2 font-semibold">{item.quantity}</span>
            <button
              className="px-2 text-lg font-bold text-gray-600 hover:text-green-600"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              +
            </button>
          </div>

          <button
            disabled={isRemoving}
            onClick={handleRemove}
            className={`text-sm font-semibold ${
              isRemoving ? "text-gray-400" : "text-red-500 hover:text-red-700"
            }`}
          >
            {isRemoving ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>

      {error && <p className="mt-1 text-right text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default CartItem;
