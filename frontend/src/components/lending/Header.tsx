import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "react-feather";

interface NavItem {
  name: string;
  href: string;
}

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-blue-600" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white font-bold text-xl">
              Tutor Connect
            </Link>
          </div>
          <div className="hidden md:block">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-teal-500 transition-all duration-300">
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-all duration-300 ml-4"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-teal-500 transition-all duration-300">
                  Sign Up
                </Link>
                <Link to="/login" className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-teal-500 transition-all duration-300 ml-4">
                  Log In
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="w-full text-center bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-teal-500 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-center bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-all duration-300 mt-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="w-full text-center bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-teal-500 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="w-full text-center bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-teal-500 transition-all duration-300 mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
