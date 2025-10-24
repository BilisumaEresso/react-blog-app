import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";

const PrivateNavbar = () => {
  const auth = useAuth();
  const role = auth.role;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    window.localStorage.removeItem("blogData");
    toast.success("Logged out successfully!!", {
      position: "top-right",
      autoClose: true,
    });
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-3 text-xs font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-sm border border-blue-700"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-sm border border-blue-700"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent"
    }`;

  const getRoleBadge = (role) => {
    const roleConfig = {
      1: {
        label: "Super Admin",
        color: "bg-purple-100 text-purple-800 border-purple-200",
      },
      2: { label: "Admin", color: "bg-blue-100 text-blue-800 border-blue-200" },
      3: { label: "User", color: "bg-gray-100 text-gray-800 border-gray-200" },
    };

    return roleConfig[role] || roleConfig[3];
  };

  const roleBadge = getRoleBadge(role);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation - Compact */}
        <div className="flex justify-between items-center">
          {/* Left Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex space-x-1 py-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            {(role === 1 || role === 2) && (
              <NavLink to="/categories" className={navLinkClass}>
                Categories
              </NavLink>
            )}

            <NavLink to="/posts" className={navLinkClass}>
              Posts
            </NavLink>

            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>

            <NavLink to="/setting" className={navLinkClass}>
              Settings
            </NavLink>
          </div>

          {/* Right Section - Role & Logout */}
          <div className="flex items-center space-x-3">
            {/* Role Badge - Hidden on mobile */}
            <div
              className={`hidden sm:flex px-2 py-1 rounded-full border text-xs font-medium ${roleBadge.color}`}
            >
              {roleBadge.label}
            </div>

            {/* Logout Button - Hidden on mobile */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-3 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              Logout
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden bg-gray-100 hover:bg-gray-200 p-1.5 rounded-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg
                className="w-10 h-10 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Compact */}
        {isMenuOpen && (
          <div className="md:hidden py-2 border-t border-gray-200 bg-white">
            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <NavLink
                to="/"
                className={mobileNavLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>

              {(role === 1 || role === 2) && (
                <NavLink
                  to="/categories"
                  className={mobileNavLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </NavLink>
              )}

              <NavLink
                to="/posts"
                className={mobileNavLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Posts
              </NavLink>

              <NavLink
                to="/profile"
                className={mobileNavLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </NavLink>

              <NavLink
                to="/setting"
                className={mobileNavLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </NavLink>
            </div>

            {/* Mobile Role & Logout */}
            <div className="mt-2 pt-2 border-t border-gray-200 space-y-2">
              {/* Role Badge - Mobile */}
              <div
                className={`px-3 py-1 rounded-full border text-xs font-medium ${roleBadge.color}`}
              >
                Role: {roleBadge.label}
              </div>

              {/* Logout Button - Mobile */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 text-xs font-medium transition-all duration-200 rounded-3 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PrivateNavbar;
