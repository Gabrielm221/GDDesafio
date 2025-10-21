import { ArticleWithAuthorAndTags } from '../repository/ArticleRepository';

// Contrato para o Repositorio de Artigos (O Service dependerá desta Interface)
export interface IArticleRepository {
  findArticles(params: {
    page: number;
    pageSize: number;
    search?: string;
    tag?: string;
  }): Promise<{ articles: ArticleWithAuthorAndTags[]; total: number }>;
}
