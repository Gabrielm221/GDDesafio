// src/services/CommentService.ts
import { Comment } from '@prisma/client';
import { CommentWithAuthor } from '../repository/CommentRepository';
import { ICommentRepository } from '../types/CommentInterface';

// Classe de Negocio (SRP)
export class CommentService {
    private repository: ICommentRepository;
    // ID padrao para o MVP (simula o usuário logado, inicialmente nao temos usuario)
    private readonly DEFAULT_USER_ID = 1; 

    constructor(repository: ICommentRepository) {
        this.repository = repository;
    }

    public async addComment(articleId: number, content: string): Promise<Comment> {
        // Regra de Negocio: Aplica o ID de usuario padrão
        const createdComment = await this.repository.create({
            articleId: articleId,
            content: content,
            userId: this.DEFAULT_USER_ID,
        });

        return createdComment;
    }

    public async getCommentsByArticle(articleId: number): Promise<CommentWithAuthor[]> {
        return this.repository.findByArticleId(articleId);
    }
}