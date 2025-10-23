import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { IUserUpdate } from "../types/UserInterface";

export class UserController {
  // Injeção de Dependência via construtor, padronizando com Article/CommentController
  constructor(private userService: UserService) {}

  // Método padronizado: public async create
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;
      await this.userService.createUser(name, email, password);
      return res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error: any) {
      // Padroniza a resposta de erro para Bad Request, pois é um erro de validação/negócio
      return res.status(400).json({ error: error.message });
    }
  }

  // Método padronizado: public async login
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const token = await this.userService.login(email, password);
      return res.status(200).json({ message: "Login bem-sucedido!", token });
    } catch (error: any) {
      // Padroniza a resposta para Credenciais Inválidas
      return res.status(401).json({ error: error.message });
    }
  }

  //Método padronizado: public async logout
  public async logout(req: Request, res: Response): Promise<Response> {
    const token = req.headers.authorization?.split(" ")[1];

    try {
      if (!token) {
        return res
          .status(400)
          .json({ message: "Token não fornecido. Não foi possível realizar o logout." });
      }

      const msg = await this.userService.logout(token);
      return res.status(200).json({ message: msg });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: "Erro inesperado. Tente novamente mais tarde." });
    }
  }

  // Método padronizado: public async update
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const dados: IUserUpdate = req.body; 

      if (req.file) {
        dados.profilePictureUrl = `${req.file.filename}`;
      }
      
      await this.userService.updateUser(Number(id), dados, req.file);

      return res.status(200).json({ message: "Usuário editado com sucesso!" });
    } catch (error: any) {
      // Assumimos que o 400 é para erros de validação e 404 para usuário não encontrado.
      if (error.message.includes('Usuário não encontrado')) {
          return res.status(404).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  // Método padronizado: public async getLoggedUser
  public async getLoggedUser(req: Request, res: Response): Promise<Response> {
    const token = req.headers.authorization?.split(" ")[1];
    
    try {
      if (!token) {
        return res.status(400).json({ message: "Token não fornecido." });
      }
      
      const user = await this.userService.searchLoggedUser(token);
      return res.status(200).json(user);
    } catch (error: any) {
      console.error(error);
      return res.status(401).json({ message: error.message || "Token inválido ou expirado." });
    }
  }
}