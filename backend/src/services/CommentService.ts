import { Comment } from '@prisma/client';
import { CommentWithAuthorAndReplies } from '../repository/CommentRepository';
import { ICommentRepository } from '../types/CommentInterface';

export class CommentService {
  private repository: ICommentRepository;

  constructor(repository: ICommentRepository) {
    this.repository = repository;
  }

  public async addComment(
    articleId: number,
    content: string,
    userId: number,
    parentId?: number
  ): Promise<Comment> {
    // O Repositório é chamado para criar o registro (espera-se o tipo Comment base)
    const createdComment = await this.repository.create({
      articleId: articleId,
      content: content,
      userId: userId,
      parentId: parentId,
    });

    // Retorna o tipo base Comment (o TS não deve reclamar se o Repositório estiver certo)
    return createdComment;
  }

  public async getCommentsByArticle(articleId: number): Promise<CommentWithAuthorAndReplies[]> {
    return this.repository.findByArticleId(articleId);
  }
}
