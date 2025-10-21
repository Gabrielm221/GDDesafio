import { ArticleWithAuthorAndTags } from '../repository/ArticleRepository';
import { IArticleRepository } from '../types/ArticleInterface'; 

// Tipo de retorno de Paginação
type PaginatedResponse = {
    data: ArticleWithAuthorAndTags[];
    meta: { totalItems: number; pageSize: number; currentPage: number; totalPages: number; };
}

export class ArticleService {
  private repository: IArticleRepository; 

  constructor(repository: IArticleRepository) {
    this.repository = repository;
  }

  public async getArticles({ page, pageSize, search, tag }: { 
    page?: number; pageSize?: number; search?: string; tag?: string;
  }): Promise<PaginatedResponse> {
    
    // Regra de Negócio: Paginação e Valores Padrão
    const defaultPageSize = 10;
    
    // 1. Garante que a página seja no mínimo 1.
    const currentPage = Math.max(1, page || 1);
    
    // 2. CORREÇÃO DA LÓGICA:
    // Se pageSize FOI fornecido (não é undefined), aplica o mínimo de 1.
    // Se for undefined (sem valor), aplica o padrão de 10.
    const limit = pageSize !== undefined ? Math.max(1, pageSize) : defaultPageSize;
    
    const finalSearch = search ? search.trim() : undefined;
    const finalTag = tag ? tag.trim() : undefined;

    const result = await this.repository.findArticles({
      page: currentPage,
      pageSize: limit, // Usa o valor corrigido 'limit'
      search: finalSearch,
      tag: finalTag,
    });
    
    // Regra de Negócio: Cálculo de Metadados
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