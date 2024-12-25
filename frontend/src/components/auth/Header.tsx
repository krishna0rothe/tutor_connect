import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">Tutor Connect</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-medium text-white hover:underline">
            Login
          </Link>
          <Link to="/signup" className="text-sm font-medium text-white hover:underline">
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

