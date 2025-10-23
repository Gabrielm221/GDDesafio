import { IArticleRepository } from '../types/ArticleInterface';
import { ArticleWithAuthorAndTags } from '../repository/ArticleRepository';

type PaginatedResponse = {
  data: ArticleWithAuthorAndTags[];
  meta: { totalItems: number; pageSize: number; currentPage: number; totalPages: number };
};

export class ArticleService {
  constructor(private repository: IArticleRepository) {}

  public async getArticles(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    tag?: string;
  }): Promise<PaginatedResponse> {
    const page = Math.max(1, params.page || 1);
    const pageSize = params.pageSize ? Math.max(1, params.pageSize) : 10;

    const { articles, total } = await this.repository.findArticles({
      page,
      pageSize,
      search: params.search?.trim(),
      tag: params.tag?.trim(),
    });

    return {
      data: articles,
      meta: {
        totalItems: total,
        pageSize,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  public async getArticleById(id: number): Promise<ArticleWithAuthorAndTags | null> {
    return this.repository.findById(id);
  }

  public async createArticle(data: {
    title: string;
    content: string;
    authorId: number;
    tags?: string[];
    imageUrl?: string;
  }): Promise<ArticleWithAuthorAndTags> {
    if (!data.title || !data.content || !data.authorId)
      throw new Error('Título, conteúdo e authorId são obrigatórios');
    return this.repository.createArticle(data);
  }

  public async updateArticle(
    id: number,
    data: { title?: string; content?: string; tags?: string[]; imageUrl?: string }
  ): Promise<ArticleWithAuthorAndTags | null> {
    if (!data.title && !data.content && !data.tags && !data.imageUrl)
      throw new Error('Pelo menos um campo deve ser fornecido para atualização.');

    if (data.title && data.title.trim().length === 0) throw new Error('Título não pode ser vazio.');

    return this.repository.updateArticle(id, data);
  }
}
