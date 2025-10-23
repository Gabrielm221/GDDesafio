import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { blackListToken } from "../middlewares/authMiddlewares";
import { User } from "@prisma/client";
import { IUserUpdate } from "../types/UserInterface"; // Interface de tipagem do DTO de Update
import { IUserRepository } from "../types/UserInterface"; // Interface de Contrato formal

export class UserService {
  private userRepository: IUserRepository; // Propriedade para armazenar o repositório injetado

  // Recebe o repositório via Injeção de Dependência (SOLID DIP)
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    const userExistent = await this.userRepository.searchByEmail(email); 
    if (userExistent) throw new Error("Email já cadastrado.");

    const encryptedPassword = await bcrypt.hash(password, 10);

    const novouser = await this.userRepository.create({ 
      name,
      email,
      password: encryptedPassword,
    } as any);
    return novouser;
  }

  async login(email: string, password: string): Promise<string> {
    const user: User | null = await this.userRepository.searchByEmail(email); 
    if (!user) throw new Error("Credenciais inválidas");

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) throw new Error("Credenciais inválidas");

    if (!process.env.SECRET_JWT) throw new Error("SECRET_JWT não definido!");

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.SECRET_JWT as string,
      { expiresIn: "1h" }
    );
    return token;
  }

  async logout(token: string): Promise<string> {
    try {
      blackListToken(token);
      return "Logout realizado com sucesso!";
    } catch (error) {
      throw new Error(
        "Erro ao tentar realizar o logout. Tente novamente mais tarde."
      );
    }
  }
  
  async updateUser(id: number, dados: IUserUpdate, file?: Express.Multer.File): Promise<User> {
    // 1. Lógica de Negócio: Se a senha estiver presente no DTO, encripta antes de atualizar
    if (dados.password) {
      dados.password = await bcrypt.hash(dados.password, 10);
    }
    
    // 2. Chama o Repositório, passando o DTO tipado (IUserUpdate)
    const updatedUser = await this.userRepository.update(id, dados); 
    
    // 3. Verifica se a atualização foi bem-sucedida
    if (!updatedUser) {
        throw new Error('Usuário não encontrado para atualização.');
    }
    
    return updatedUser;
  }

  // buscar usuário pelo token
  async searchLoggedUser(token: string): Promise<User> {
    if (!process.env.SECRET_JWT) throw new Error("SECRET_JWT não definido!");

    const decoded = jwt.verify(token, process.env.SECRET_JWT as string) as {
      id: number;
    };
    const user = await this.userRepository.searchById(decoded.id); 
    if (!user) throw new Error("Usuário não encontrado");

    return user;
  }
}