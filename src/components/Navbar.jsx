// src/components/Navbar.jsx - Simple version with direct links
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    // Get data from localStorage on component mount
    setUserRole(localStorage.getItem('userRole'));
    setUserName(localStorage.getItem('userName'));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserRole(null);
    setUserName(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            SMIT Connect
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium">
            Home
          </Link>
          
          {/* Student Menu */}
          {userRole === 'student' && (
            <>
              <Link to="/student/courses" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">Courses</Link>
              <Link to="/student/my-leaves" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">My Leaves</Link>
              <Link to="/student/apply-leave" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">Apply Leave</Link>
              <Link to="/student/my-courses" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">My Courses</Link>
            </>
          )}
          
          {/* Admin Menu */}
          {userRole === 'admin' && (
            <>
              <Link to="/admin/manage-students" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                Students
              </Link>
              <Link to="/admin/manage-courses" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                Courses
              </Link>
              <Link to="/admin/manage-leaves" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                Leaves
              </Link>
              <Link to="/admin" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                Dashboard
              </Link>
              <Link to="/admin/manage-admissions" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                📝 Applications
              </Link>
            </>
          )}

          {userRole ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">👋 {userName}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/student-login">
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-md">
                  Student Login
                </button>
              </Link>
              <Link to="/admin-login">
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-md">
                  Admin Login
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-blue-400"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700 py-4 px-6 shadow-lg">
          <div className="flex flex-col gap-3">
            <Link to="/" className="text-gray-300 hover:text-blue-400 py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            
            {userRole === 'student' && (
              <>
                <Link to="/student/courses" className="text-gray-300 hover:text-blue-400 py-2" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
                <Link to="/student/my-leaves" className="text-gray-300 hover:text-blue-400 py-2" onClick={() => setMobileMenuOpen(false)}>My Leaves</Link>
                <Link to="/student/apply-leave" className="text-gray-300 hover:text-blue-400 py-2" onClick={() => setMobileMenuOpen(false)}>Apply Leave</Link>
                <Link to="/student/my-courses" className="text-gray-300 hover:text-blue-400 py-2" onClick={() => setMobileMenuOpen(false)}>My Courses</Link>
              </>
            )}
            
            {userRole === 'admin' && (
              <>
                <Link to="/admin/manage-students" className="text-gray-300 hover:text-blue-400 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Students
                </Link>
                <Link to="/admin/manage-courses" className="text-gray-300 hover:text-blue-400 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Courses
                </Link>
                <Link to="/admin/manage-leaves" className="text-gray-300 hover:text-blue-400 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Leaves
                </Link>
                <Link to="/admin" className="text-gray-300 hover:text-blue-400 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              </>
            )}

            {userRole ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-red-400 hover:text-red-300 py-2 font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/student-login" className="text-blue-400 hover:text-blue-300 py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Student Login
                </Link>
                <Link to="/admin-login" className="text-blue-400 hover:text-blue-300 py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;