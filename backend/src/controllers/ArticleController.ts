import { Request, Response } from 'express';
import { ArticleService } from '../services/ArticleService';

// Classe que lida com HTTP (SRP)
export class ArticleController {
  private articleService: ArticleService;

  constructor(articleService: ArticleService) {
    this.articleService = articleService;
  }

  // GET /api/articles?page=...&search=...
  public async getArticles(req: Request, res: Response): Promise<Response> {
    try {
      // O Controller extrai e converte os parametros da requisicao
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined;
      const search = req.query.search as string | undefined;
      const tag = req.query.tag as string | undefined;

      // Chama o Service (Regra de Negocio)
      const result = await this.articleService.getArticles({ page, pageSize, search, tag });

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}