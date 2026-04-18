// src/components/Footer.jsx
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-8 mb-6">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">SMIT Connect</h3>
            <p className="text-gray-400 text-sm">
              Complete student management system for course admissions and leave management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/courses" className="text-gray-400 hover:text-blue-400 transition-colors">Courses</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Student Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">For Students</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/student-login" className="text-gray-400 hover:text-blue-400 transition-colors">Student Login</Link></li>
              <li><Link to="/student-signup" className="text-gray-400 hover:text-blue-400 transition-colors">Sign Up</Link></li>
              <li><Link to="/courses" className="text-gray-400 hover:text-blue-400 transition-colors">Browse Courses</Link></li>
            </ul>
          </div>

          {/* Admin Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">For Admins</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/admin-login" className="text-gray-400 hover:text-blue-400 transition-colors">Admin Login</Link></li>
              <li><Link to="/admin/students" className="text-gray-400 hover:text-blue-400 transition-colors">Manage Students</Link></li>
              <li><Link to="/admin/courses" className="text-gray-400 hover:text-blue-400 transition-colors">Manage Courses</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} SMIT Connect Portal. All Rights Reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Developed with ❤️ for Student Management
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;