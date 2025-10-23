import { Request, Response } from 'express';
import { CommentService } from '../services/CommentService';

// Tipagem auxiliar para acessar req.user
interface CustomRequest extends Request {
  user?: { id: number; name: string; email: string };
}

export class CommentController {
  private commentService: CommentService;

  constructor(commentService: CommentService) {
    this.commentService = commentService;
  }

  public async createComment(req: Request, res: Response): Promise<Response> {
    const authenticatedReq = req as CustomRequest;

    try {
      const articleId = parseInt(req.params.articleId);
      const { content, parentId } = req.body; // NOVO: Recebe parentId (opcional)
      const userId = authenticatedReq.user?.id;

      // 1. Validação de segurança
      if (!userId) {
        return res.status(401).json({ message: 'Autenticação necessária.' });
      }

      // 2. Validação de entrada
      if (isNaN(articleId) || articleId <= 0) {
        return res.status(400).json({ message: 'ID do artigo inválido.' });
      }
      if (!content || content.trim().length < 5) {
        return res
          .status(400)
          .json({ message: 'Conteúdo do comentário deve ter no mínimo 5 caracteres.' });
      }

      //CHAMA O SERVIÇO PASSANDO O userId E parentId
      const newComment = await this.commentService.addComment(
        articleId,
        content.trim(),
        userId,
        parentId ? parseInt(parentId) : undefined // Converte parentId para number se existir
      );

      return res.status(201).json(newComment);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao adicionar comentário.' });
    }
  }

  public async getComments(req: Request, res: Response): Promise<Response> {
    try {
      const articleId = parseInt(req.params.articleId);
      if (isNaN(articleId) || articleId <= 0) {
        return res.status(400).json({ message: 'ID do artigo inválido.' });
      }

      const comments = await this.commentService.getCommentsByArticle(articleId);

      return res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar comentários.' });
    }
  }
}
