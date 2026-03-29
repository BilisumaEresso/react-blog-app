import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import { useTheme } from "./context/ThemeContext";

const PrivateNavbar = () => {
  const auth = useAuth();
  const role = auth.role;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    window.localStorage.removeItem("blogData");
    toast.success("Logged out successfully!!", {
      position: "top-right",
      autoClose: true,
    });
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/20"
        : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
        : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
    <div className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 max-w-[90rem] mx-auto w-full transition-all duration-300 mb-8">
      <nav className="bg-white/70 dark:bg-[var(--color-dark-card)]/70 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/40 dark:border-white/10 rounded-3xl transition-colors duration-300 px-4 md:px-6 py-2.5">
        {/* Desktop Navigation - Compact */}
        <div className="flex justify-between items-center h-12">
          {/* Left Navigation Links - Hidden on mobile */}
          <div className="hidden lg:flex space-x-2 py-2 items-center">
            
            <div className="shrink-0 flex items-center pr-4 border-r border-gray-200 dark:border-gray-700/50 mr-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold tracking-tighter shadow-lg shadow-blue-500/30 mr-2">
                B
              </div>
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight text-lg">
                Blog
              </span>
            </div>
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

            <NavLink to="/puzzle" className={navLinkClass}>
              Play 2048
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

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Logout Button - Hidden on mobile */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex bg-red-500 hover:bg-red-600 text-white px-5 py-2 text-sm font-bold transition-all duration-300 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ring-1 ring-white/20"
            >
              Logout
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
            >
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Compact */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
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

              <NavLink
                to="/puzzle"
                className={mobileNavLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Play 2048
              </NavLink>
            </div>

            {/* Mobile Role & Logout */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
              {/* Role Badge - Mobile */}
              <div
                className={`px-3 py-1.5 rounded-xl border text-sm font-medium inline-block ${roleBadge.color}`}
              >
                Role: {roleBadge.label}
              </div>

              {/* Logout Button - Mobile */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 text-sm font-bold transition-all duration-300 rounded-xl shadow-lg shadow-red-500/30 ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default PrivateNavbar;
