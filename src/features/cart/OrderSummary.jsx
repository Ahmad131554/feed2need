function OrderSummary({
  subtotal = 0,
  nextPath = "/checkout",
  onSubmitTrigger,
}) {
  const tax = 0;
  const shipping = 200;
  const total = subtotal + tax + shipping;

  const handleClick = (e) => {
    e.preventDefault();
    if (onSubmitTrigger) onSubmitTrigger();
    else window.location.href = nextPath;
  };

  const showButton = nextPath !== null;

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h3 className="mb-6 text-2xl font-semibold text-gray-800">
        Order Summary
      </h3>

      <div className="space-y-4 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rs. {subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>Rs. {tax}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Rs. {shipping}</span>
        </div>
        <div className="flex justify-between border-t pt-4 font-semibold text-gray-800">
          <span>Total</span>
          <span className="text-green-600">Rs. {total}</span>
        </div>
      </div>

      {showButton && (
        <button
          type="button"
          onClick={handleClick}
          className="mt-6 w-full rounded-md bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          {nextPath === "/checkout" ? "Proceed to Checkout" : "Place Order"}
        </button>
      )}
    </div>
  );
}

export default OrderSummary;
