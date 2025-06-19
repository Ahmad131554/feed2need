function Button({ children }) {
  return (
    <button className="mt-4 rounded bg-green-500 px-6 py-2 text-white">
      {children}
    </button>
  );
}

export default Button;
