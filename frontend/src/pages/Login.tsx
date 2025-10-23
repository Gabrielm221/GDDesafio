import { useEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading";
import HeaderCustom from '../components/Header'; 
import logoUrl from "../assets/graodireto.webp"; 
import { userService } from '../service/userService'; 

const ACTION_COLOR_GREEN = '#6B9042'; 
const INPUT_BG_COLOR = '#f0f6ec'; 
const LOGO_HEIGHT = 40; 

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // VERIFICA SE O USUARIO JA ESTA LOGADO
  useEffect(() => {
    if (userService.isLoggedIn()) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null); 
    
    try {
      // CHAMA O SERVIÇO DE LOGIN
      await userService.login({ email, password });
      
      // 2. REDIRECIONA PARA A PAGINA PRINCIPAL APOS LOGIN
      navigate("/home"); 
      
    } catch (error: any) {
     
      const message =
        error?.response?.data?.error || "Credenciais inválidas. Tente novamente.";
      setErrorMessage(message);
      
    } finally {
      setIsLoading(false); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
  
    <div className="min-h-screen flex flex-col bg-white">
      <HeaderCustom />

      {isLoading && <Loading />}

  
      <div className="flex items-center justify-center flex-grow p-4 md:p-8">
        <div className="w-full max-w-sm p-8 bg-white">
          
          <div className="flex justify-center mb-6">
            
             <img 
                src={logoUrl} 
                alt="Grão Direto Logo" 
                style={{ height: `${LOGO_HEIGHT}px`, width: 'auto' }} 
             />
          </div>

          <h2 className="text-3xl font-serif text-center mb-8 text-gray-800">
            Bem-vindo de volta
          </h2>

          {errorMessage && (
            <div className="text-red-600 text-center font-medium text-sm mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* EMAIL */}
            <div className="form-group">
                <label className="text-gray-700 block mb-1">Email</label>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-md p-3 text-gray-800 transition"
                    style={{ backgroundColor: INPUT_BG_COLOR, border: '1px solid transparent' }}
                />
            </div>
            
            {/* SENHA */}
            <div className="form-group">
                <label className="text-gray-700 block mb-1">Senha</label>
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-md p-3 text-gray-800 transition"
                    style={{ backgroundColor: INPUT_BG_COLOR, border: '1px solid transparent' }}
                />
            </div>

            {/* BOTAO PARA ENTRAR */}
            <div className="pt-4">
                <button 
                    type="submit"
                    className="w-full text-white px-6 py-3 rounded-md transition font-semibold hover:opacity-90"
                    style={{ backgroundColor: ACTION_COLOR_GREEN, opacity: isLoading ? 0.7 : 1 }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
            </div>

           {/* ESQUECI SENHA, FUNCAO FUTURA, AGORA APENAS PARA DEMONSTRACAO */}
            <div className="text-center mt-4">
              <Link to="/forgot-password" className="text-gray-500 hover:underline text-sm">
                Esqueci minha senha
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}