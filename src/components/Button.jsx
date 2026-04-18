// src/components/Button.jsx
import { Loader } from "lucide-react";

const Button = ({ text, onClick, loading, type = "button", variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25",
    secondary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-500/25",
    success: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25",
    outline: "border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 ${variants[variant]} ${className}`}
    >
      {loading && <Loader size={18} className="animate-spin" />}
      {text}
    </button>
  );
};

export default Button;