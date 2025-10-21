import { ArticleWithAuthorAndTags } from '../repository/ArticleRepository';
import { IArticleRepository } from '../types/ArticleInterface';

type PaginatedResponse = {
  data: ArticleWithAuthorAndTags[];
  meta: {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
};

// Classe de Negocio (SRP)
export class ArticleService {
  private repository: IArticleRepository;

  constructor(repository: IArticleRepository) {
    this.repository = repository;
  }

  public async getArticles({
    page,
    pageSize,
    search,
    tag,
  }: {
    page?: number;
    pageSize?: number;
    search?: string;
    tag?: string;
  }): Promise<PaginatedResponse> {
    // Regra de Negócio: Paginação e Valores Padrão
    const currentPage = Math.max(1, page || 1);
    const limit = Math.max(1, pageSize || 10); // Paginação
    const finalSearch = search ? search.trim() : undefined;
    const finalTag = tag ? tag.trim() : undefined;

    const result = await this.repository.findArticles({
      page: currentPage,
      pageSize: limit,
      search: finalSearch,
      tag: finalTag,
    });

    // Regra de Negocio: Calculo de Metadados
    const totalPages = Math.ceil(result.total / limit);

    return {
      data: result.articles,
      meta: {
        totalItems: result.total,
        pageSize: limit,
        currentPage: currentPage,
        totalPages: totalPages,
      },
    };
  }
}
