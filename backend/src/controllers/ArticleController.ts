import { Request, Response } from 'express';
import { ArticleService } from '../services/ArticleService';

export class ArticleController {
  constructor(private articleService: ArticleService) {}

  public async getArticles(req: Request, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined;
      const search = req.query.search as string | undefined;
      const tag = req.query.tag as string | undefined;

      const result = await this.articleService.getArticles({ page, pageSize, search, tag });
      return res.status(200).json(result);
    } catch (err) { return res.status(500).json({ message: 'Erro interno do servidor.' }); }
  }

  public async getArticleById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const article = await this.articleService.getArticleById(id);
      if (!article) return res.status(404).json({ message: 'Artigo não encontrado.' });
      return res.status(200).json(article);
    } catch (err) { return res.status(500).json({ message: 'Erro interno do servidor.' }); }
  }

  public async createArticle(req: Request, res: Response) {
    try {
      const { title, content, authorId, tags } = req.body;
      const article = await this.articleService.createArticle({ title, content, authorId, tags });
      return res.status(201).json(article);
    } catch (err: any) { return res.status(400).json({ message: err.message }); }
  }

  public async updateArticle(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { title, content, tags } = req.body;
      const updated = await this.articleService.updateArticle(id, { title, content, tags });
      if (!updated) return res.status(404).json({ message: 'Artigo não encontrado para atualização.' });
      return res.status(200).json(updated);
    } catch (err) { return res.status(500).json({ message: 'Erro interno do servidor.' }); }
  }
}
