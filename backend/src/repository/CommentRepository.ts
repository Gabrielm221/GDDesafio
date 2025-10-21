import { PrismaClient, Comment, Prisma } from '@prisma/client';
import { ICommentRepository } from '../types/CommentInterface';

export type CommentCreateInput = Omit<Prisma.CommentCreateInput, 'user' | 'article'> & {
    userId: number;
    articleId: number;
};
export type CommentWithAuthor = Prisma.CommentGetPayload<{ include: { user: { select: { name: true } } } }>;

// Implementa o Contrato (OCP/DIP)
export class CommentRepository implements ICommentRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async create(data: CommentCreateInput): Promise<Comment> {
        return this.prisma.comment.create({ data: { content: data.content, userId: data.userId, articleId: data.articleId } });
    }

    public async findByArticleId(articleId: number): Promise<CommentWithAuthor[]> {
        return this.prisma.comment.findMany({
            where: { articleId },
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: 'asc' }
        });
    }
}