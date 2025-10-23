import { PrismaClient, Comment, Prisma } from '@prisma/client';
import { ICommentRepository } from '../types/CommentInterface';

export type CommentCreateInput = Omit<
  Prisma.CommentCreateInput,
  'user' | 'article' | 'parent' | 'replies'
> & {
  userId: number;
  articleId: number;
  parentId?: number;
};
export type CommentWithAuthorAndReplies = Prisma.CommentGetPayload<{
  include: {
    user: { select: { id: true; name: true } };
    replies: { include: { user: { select: { id: true; name: true } } } };
  };
}>;

export class CommentRepository implements ICommentRepository {
  constructor(private prisma: PrismaClient) {}

  public async create(data: CommentCreateInput): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        content: data.content,
        userId: data.userId,
        articleId: data.articleId,
        parentId: data.parentId,
      },
      //
    });
  }

  public async findByArticleId(articleId: number): Promise<CommentWithAuthorAndReplies[]> {
    return this.prisma.comment.findMany({
      where: {
        articleId,
        parentId: null, // Busca apenas comentários pais
      },

      include: {
        user: { select: { id: true, name: true } },
        replies: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
