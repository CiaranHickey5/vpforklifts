import React from "react";
import { Menu, X } from "lucide-react";
import { useApp } from "../../context/AppContext";

const Header = () => {
  const {
    navigateTo,
    isMenuOpen,
    setIsMenuOpen,
    isAuthenticated,
    handleLogout,
    setShowLoginModal,
  } = useApp();

  return (
    <>
      {/* Top Header Bar */}
      <div className="bg-gray-900 text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <a href="tel:+35351293208" className="hover:text-blue-300">
                Tel: +353 (0) 51 293 208
              </a>
              <span className="hidden sm:inline">|</span>
              <a href="tel:+353872501934" className="hover:text-blue-300">
                Mobile: +353 (0) 87 250 1934
              </a>
            </div>
            <div>
              {isAuthenticated ? (
                <button onClick={handleLogout} className="hover:text-blue-300">
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="hover:text-blue-300"
                >
                  Admin Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigateTo("home")}
              className="text-xl font-bold text-gray-900 hover:text-blue-600"
            >
              Virgil Power Forklifts
            </button>

            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => navigateTo("home")}
                className="text-gray-700 hover:text-blue-600"
              >
                Home
              </button>
              <button
                onClick={() => navigateTo("shop")}
                className="text-gray-700 hover:text-blue-600"
              >
                Products
              </button>
              <button
                onClick={() => navigateTo("contact")}
                className="text-gray-700 hover:text-blue-600"
              >
                Contact
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => navigateTo("admin")}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Admin
                </button>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 py-3 space-y-1">
              <button
                onClick={() => navigateTo("home")}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                Home
              </button>
              <button
                onClick={() => navigateTo("shop")}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                Products
              </button>
              <button
                onClick={() => navigateTo("contact")}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                Contact
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => navigateTo("admin")}
                  className="block w-full text-left px-3 py-2 text-blue-600 hover:bg-gray-100"
                >
                  Admin
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
