import { Comment } from '@prisma/client';
import { CommentCreateInput, CommentWithAuthorAndReplies } from '../repository/CommentRepository';

export interface ICommentRepository {
  create(data: CommentCreateInput): Promise<Comment>;
  findByArticleId(articleId: number): Promise<CommentWithAuthorAndReplies[]>;
}
