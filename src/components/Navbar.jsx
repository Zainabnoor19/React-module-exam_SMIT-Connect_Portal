import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

        <h1 className="text-2xl font-bold text-blue-600">
          MyApp
        </h1>

        <div className="hidden md:flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>

        <Menu className="md:hidden" />

      </div>
    </nav>
  );
};

export default Navbar;