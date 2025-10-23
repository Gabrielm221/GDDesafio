import api from './api'; 

// TIPAGEM DAS CREDENCIAIS DE LOGIN
interface Credentials {
    email: string;
    password: string;
}

interface UserData extends Credentials {
    name: string;
    confirmPassword: string;
}

//RESPOSTA ESPERADA DO TOKEN
interface AuthResponse {
    token: string;
    message: string;
}

export const userService = {
    /**
     * TENTA LOGAR O USUARIO COM EMAIL E SENHA
     */
    async login({ email, password }: Credentials): Promise<string> {
        try {
            // USANDO O CLIENTE 'api' PARA LOGAR EM http://localhost:3001/api/users/login
            const response = await api.post<AuthResponse>('/api/users/login', {
                email,
                password,
            });

            const { token } = response.data;
            localStorage.setItem("token", token);
            return token;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || "Credenciais inválidas. Tente novamente.";
            throw new Error(errorMessage);
        }
    },

    /**
     * ROTA DE REGISTRO DE USUÁRIO
     */
    async register({ name, email, password, confirmPassword }: UserData): Promise<void> {
        if (password !== confirmPassword) {
            throw new Error("As senhas não coincidem");
        }
        
        try {
            // CRIA UM NOVO USUÁRIO USANDO O CLIENTE 'api'
            await api.post('/api/users/create', {
                name,
                email,
                password,
            });
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || "Erro ao criar conta. Tente novamente.";
            throw new Error(errorMessage);
        }
    },

    /**
     * VERIFICA SE O TOKEN EXISTE NO LOCALSTORAGE.
     */
    isLoggedIn: (): boolean => {
        return !!localStorage.getItem("token");
    }
};