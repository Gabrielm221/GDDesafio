import { Comment } from '@prisma/client';
import { CommentCreateInput, CommentWithAuthor } from '../repository/CommentRepository';

// Contrato para o nosso Repositorio de Comentários (O Service dependerá desta Interface)
export interface ICommentRepository {
  create(data: CommentCreateInput): Promise<Comment>;
  findByArticleId(articleId: number): Promise<CommentWithAuthor[]>;
}
