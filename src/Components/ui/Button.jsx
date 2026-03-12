export default function Button({ children, variant = "primary", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-semibold transition";
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    secondary: "border border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600",
    ghost: "text-red-600 hover:bg-red-50",
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
