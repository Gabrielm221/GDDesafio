import { PrismaClient, Prisma } from '@prisma/client';
import { IArticleRepository } from '../types/ArticleInterface';

export type ArticleWithAuthorAndTags = Prisma.ArticleGetPayload<{
  include: {
    author: { select: { name: true } };
    tags: { include: { tag: true } };
  };
}>;

export class ArticleRepository implements IArticleRepository {
  constructor(private prisma: PrismaClient) {}

  public async findArticles({ page, pageSize, search, tag }: {
    page: number;
    pageSize: number;
    search?: string;
    tag?: string;
  }): Promise<{ articles: ArticleWithAuthorAndTags[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const whereCondition: Prisma.ArticleWhereInput = {};

    if (search) {
      whereCondition.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tag) {
      whereCondition.tags = {
        some: { tag: { name: { equals: tag, mode: 'insensitive' } } },
      };
    }

    const [articles, total] = await this.prisma.$transaction([
      this.prisma.article.findMany({
        skip,
        take: pageSize,
        where: whereCondition,
        include: { author: { select: { name: true } }, tags: { include: { tag: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.article.count({ where: whereCondition }),
    ]);

    return { articles, total };
  }

  public async findById(id: number): Promise<ArticleWithAuthorAndTags | null> {
    return this.prisma.article.findUnique({
      where: { id },
      include: { author: { select: { name: true } }, tags: { include: { tag: true } } },
    });
  }

  public async createArticle(data: {
    title: string;
    content: string;
    authorId: number;
    tags?: string[];
  }): Promise<ArticleWithAuthorAndTags> {
    const tagConnectOrCreate = data.tags?.map(tagName => ({
      tag: { connectOrCreate: { where: { name: tagName }, create: { name: tagName } } },
    }));

    return this.prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: data.authorId,
        tags: tagConnectOrCreate ? { create: tagConnectOrCreate } : undefined,
      },
      include: { author: { select: { name: true } }, tags: { include: { tag: true } } },
    });
  }

  public async updateArticle(id: number, data: {
    title?: string;
    content?: string;
    tags?: string[];
  }): Promise<ArticleWithAuthorAndTags | null> {
    const existing = await this.prisma.article.findUnique({ where: { id } });
    if (!existing) return null;

    // Atualiza tags: remove todas e cria novas
    if (data.tags) {
      await this.prisma.articleOnTag.deleteMany({ where: { articleId: id } });
    }

    const tagConnectOrCreate = data.tags?.map(tagName => ({
      tag: { connectOrCreate: { where: { name: tagName }, create: { name: tagName } } },
    }));

    return this.prisma.article.update({
      where: { id },
      data: {
        title: data.title ?? existing.title,
        content: data.content ?? existing.content,
        tags: tagConnectOrCreate ? { create: tagConnectOrCreate } : undefined,
      },
      include: { author: { select: { name: true } }, tags: { include: { tag: true } } },
    });
  }
}
