import { Loader } from "lucide-react";

const Button = ({ text, onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
    >
      {loading && <Loader size={18} className="animate-spin" />}
      {text}
    </button>
  );
};

export default Button;