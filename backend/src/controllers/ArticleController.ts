import { Request, Response } from 'express';
import { ArticleService } from '../services/ArticleService';

// Tipagem auxiliar para o objeto injetado pelo middleware 
interface AuthUserPayload {
    id: number;
    name: string;
    email: string;
}
// Extensão da Request para facilitar a leitura no Controller
interface CustomRequest extends Request {
    user?: AuthUserPayload; 
}


export class ArticleController {
  constructor(private articleService: ArticleService) {}

  public async getArticles(req: Request, res: Response): Promise<Response> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined;
      const search = req.query.search as string | undefined;
      const tag = req.query.tag as string | undefined;

      const result = await this.articleService.getArticles({ page, pageSize, search, tag });
      return res.status(200).json(result);
    } catch (err) { return res.status(500).json({ message: 'Erro interno do servidor.' }); }
  }

  public async getArticleById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const article = await this.articleService.getArticleById(id);
      if (!article) return res.status(404).json({ message: 'Artigo não encontrado.' });
      return res.status(200).json(article);
    } catch (err) { return res.status(500).json({ message: 'Erro interno do servidor.' }); }
  }

  // CRIAÇÃO(POST) - Obtém o authorId do Token injetado
  public async createArticle(req: Request, res: Response): Promise<Response> {
    const authenticatedReq = req as CustomRequest; // Faz o cast para acessar req.user
    
    try {
      //  Obtém o authorId de forma SEGURA do objeto injetado (middleware)
      const authorId = authenticatedReq.user?.id; 
      
      if (!authorId) {
          // Garante que o middleware foi executado e que o ID existe no token.
          return res.status(401).json({ message: 'Autenticação necessária.' }); 
      }
      
      //Recebe os dados restantes do body
      const { title, content, tags, imageUrl } = req.body; 
      
      const article = await this.articleService.createArticle({ title, content, imageUrl, authorId, tags });
      
      return res.status(201).json(article);
    } catch (err: any) { 
      return res.status(400).json({ message: err.message }); 
    }
  }

  // ATUALIZAÇÃO (PUT) - Obtém o authorId do Token injetado
  public async updateArticle(req: Request, res: Response): Promise<Response> {
    const authenticatedReq = req as CustomRequest; // Faz o cast para acessar req.user
    
    try {
      const id = parseInt(req.params.id);
      const authorId = authenticatedReq.user?.id; // Obtém o ID do usuário logado
      
      if (!authorId || isNaN(id)) {
          // Validação de segurança: ID do autor ou do artigo inválido.
          return res.status(401).json({ message: 'Autorização ou ID do artigo inválido.' });
      }

      // Recebe os dados de atualização
      const { title, content, tags, imageUrl } = req.body; 
      
      const updated = await this.articleService.updateArticle(id, { title, content, tags, imageUrl });
      
      if (!updated) return res.status(404).json({ message: 'Artigo não encontrado para atualização.' });
      return res.status(200).json(updated);
    } catch (err) { return res.status(500).json({ message: 'Erro interno do servidor.' }); }
  }
}