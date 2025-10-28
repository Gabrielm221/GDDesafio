import { PrismaClient, Prisma } from '@prisma/client';
import { IArticleRepository } from '../types/ArticleInterface';

export type ArticleWithAuthorAndTags = Prisma.ArticleGetPayload<{
  include: {
    author: { select: { name: true; id: true } };
    tags: { include: { tag: true } };
  };
}>;

export class ArticleRepository implements IArticleRepository {
  constructor(private prisma: PrismaClient) {}

  public async findArticles({
    page,
    pageSize,
    search,
    tag,
  }: {
    page: number;
    pageSize: number;
    search?: string;
    tag?: string;
  }): Promise<{ articles: ArticleWithAuthorAndTags[]; total: number }> {
    const skip = (page - 1) * pageSize;

    const whereCondition: Prisma.ArticleWhereInput = {};

    // Busca por titulo, conteudo e nome da tag
    if (search) {
      whereCondition.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { some: { tag: { name: { contains: search, mode: 'insensitive' } } } } },
      ];
    }

    // Filtro por tag específica
    if (tag) {
      // Garantindo que AND vai ser sempre um array
      const andConditions: Prisma.ArticleWhereInput[] = Array.isArray(whereCondition.AND)
        ? whereCondition.AND
        : whereCondition.AND
          ? [whereCondition.AND]
          : [];

      andConditions.push({
        tags: { some: { tag: { name: { equals: tag, mode: 'insensitive' } } } },
      });

      whereCondition.AND = andConditions;
    }

    // Paginação e total
    const [articles, total] = await this.prisma.$transaction([
      this.prisma.article.findMany({
        skip,
        take: pageSize,
        where: whereCondition,
        include: {
          author: { select: { name: true, id: true } },
          tags: { include: { tag: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.article.count({ where: whereCondition }),
    ]);

    return { articles, total };
  }

  public async findById(id: number): Promise<ArticleWithAuthorAndTags | null> {
    return this.prisma.article.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, id: true } },
        tags: { include: { tag: true } },
      },
    });
  }

  public async createArticle(data: {
    title: string;
    content: string;
    imageUrl?: string;
    authorId: number;
    tags?: string[];
  }): Promise<ArticleWithAuthorAndTags> {
    const tagConnectOrCreate = data.tags?.map((tagName) => ({
      tag: { connectOrCreate: { where: { name: tagName }, create: { name: tagName } } },
    }));

    return this.prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        authorId: data.authorId,
        tags: tagConnectOrCreate ? { create: tagConnectOrCreate } : undefined,
      },
      include: {
        author: { select: { name: true, id: true } },
        tags: { include: { tag: true } },
      },
    });
  }

  public async updateArticle(
    id: number,
    data: { title?: string; content?: string; tags?: string[]; imageUrl?: string }
  ): Promise<ArticleWithAuthorAndTags | null> {
    const existing = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, id: true } },
        tags: { include: { tag: true } },
      },
    });

    if (!existing) return null;

    if (data.tags) {
      await this.prisma.articleOnTag.deleteMany({ where: { articleId: id } });
    }

    const tagConnectOrCreate = data.tags?.map((tagName) => ({
      tag: { connectOrCreate: { where: { name: tagName }, create: { name: tagName } } },
    }));

    return this.prisma.article.update({
      where: { id },
      data: {
        title: data.title ?? existing.title,
        content: data.content ?? existing.content,
        imageUrl: data.imageUrl ?? existing.imageUrl,
        tags: tagConnectOrCreate ? { create: tagConnectOrCreate } : undefined,
      },
      include: {
        author: { select: { name: true, id: true } },
        tags: { include: { tag: true } },
      },
    });
  }
}
