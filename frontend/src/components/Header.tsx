import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from "../hooks/useAuth";

const Header: React.FC = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-none border-none">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link
          to="/home"
          className="text-textPrimary font-serif font-semibold text-xl hover:text-green-700 transition-colors"
        >
          TechBlog
        </Link>

        {/* BOTÃO DE SAIR */}
        <div className="flex items-center">
          <button
            onClick={logout}
            className="text-textPrimary hover:text-red-600 transition text-2xl ml-auto"
            aria-label="Sair"
          >
            <FiLogOut />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
