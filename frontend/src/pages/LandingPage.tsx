import React from "react";
import { useNavigate } from "react-router-dom"; 


const LandingPage: React.FC = () => {
    // 1. HOOK QUE USAMOS PARA MUDAR A ROTA
    const navigate = useNavigate();

    // 2. FUNCAO QUE MANDA PRA HOME QUANDO A PESSOA CLICAR NO BOTAO
    const handleClick = () => {
        navigate('/home'); 
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen text-center bg-white text-[#121a10]">
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-4">
                Insights & Learning
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
                Explorando tendências Tech, um post por vez
            </p>
            <button
                onClick={handleClick} 
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md transition-colors"
            >
                Começar a ler
            </button>
        </main>
    );
};

export default LandingPage;