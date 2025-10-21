import { PrismaClient, Prisma } from '@prisma/client';
import { IArticleRepository } from '../types/ArticleInterface';

export type ArticleWithAuthorAndTags = Prisma.ArticleGetPayload<{ 
  include: { 
    author: { select: { name: true } },
    tags: { include: { tag: true } }
  } 
}>;

// Implementa o nosso contrato da interface (OCP/DIP)
export class ArticleRepository implements IArticleRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Logica do DB com paginacao e filtro (Busca e Tags)
  public async findArticles({ page, pageSize, search, tag }: {
    page: number; pageSize: number; search?: string; tag?: string;
  }): Promise<{ articles: ArticleWithAuthorAndTags[], total: number }> {
    const skip = (page - 1) * pageSize;
    const whereCondition: Prisma.ArticleWhereInput = {};
    
    if (search) {
      whereCondition.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (tag) {
        whereCondition.tags = { some: { tag: { name: { equals: tag, mode: 'insensitive' } } } };
    }

    const [articles, total] = await this.prisma.$transaction([
      this.prisma.article.findMany({
        skip: skip,
        take: pageSize,
        where: whereCondition,
        include: { author: { select: { name: true } }, tags: { include: { tag: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.article.count({ where: whereCondition }),
    ]);

    return { articles, total };
  }
}