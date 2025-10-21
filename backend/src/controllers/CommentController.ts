// src/controllers/CommentController.ts
import { Request, Response } from 'express';
import { CommentService } from '../services/CommentService';

// Classe que lida com HTTP (SRP)
export class CommentController {
    private commentService: CommentService;

    constructor(commentService: CommentService) {
        this.commentService = commentService;
    }

    // POST /api/articles/:articleId/comments
    public async createComment(req: Request, res: Response): Promise<Response> {
        try {
            const articleId = parseInt(req.params.articleId);
            const { content } = req.body;

            // Validação de entradae
            if (isNaN(articleId) || articleId <= 0) {
                 return res.status(400).json({ message: 'ID do artigo inválido.' });
            }
            if (!content || content.trim().length < 5) {
                return res.status(400).json({ message: 'Conteúdo do comentário deve ter no mínimo 5 caracteres.' });
            }

            const newComment = await this.commentService.addComment(articleId, content.trim());

            return res.status(201).json(newComment);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao adicionar comentário.' });
        }
    }
    
    // GET /api/articles/:articleId/comments
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