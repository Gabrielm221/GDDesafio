import React from "react";

interface PublicHeaderProps {
    onLoginClick: () => void;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({ onLoginClick }) => {
    return (
        <header className="bg-white shadow-none border-none">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* LOGO */}
                <div className="text-textPrimary font-serif font-semibold text-xl">
                    TechBlog
                </div>

                {/* ENTRAR */}
                <button
                    onClick={onLoginClick}
                    className="text-green-800 hover:text-green-900 transition-colors font-medium"
                >
                    Entrar
                </button>
            </div>
        </header>
    );
};

export default PublicHeader;
