import { ArticleWithAuthorAndTags } from '../repository/ArticleRepository';

export interface IArticleRepository {
  findArticles(params: {
    page: number;
    pageSize: number;
    search?: string;
    tag?: string;
  }): Promise<{ articles: ArticleWithAuthorAndTags[]; total: number }>;

  // NOVO: busca artigo por ID
  findById(id: number): Promise<ArticleWithAuthorAndTags | null>;

  // NOVO: cria artigo
  createArticle(data: {
    title: string;
    content: string;
    authorId: number;
    tags?: string[];
  }): Promise<ArticleWithAuthorAndTags>;

  // NOVO: atualiza artigo
  updateArticle(id: number, data: {
    title?: string;
    content?: string;
    tags?: string[];
  }): Promise<ArticleWithAuthorAndTags | null>;
}
