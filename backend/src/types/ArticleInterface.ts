import { ArticleWithAuthorAndTags } from '../repository/ArticleRepository';

export interface IArticleRepository {
  findArticles(params: {
    page: number;
    pageSize: number;
    search?: string;
    tag?: string;
  }): Promise<{ articles: ArticleWithAuthorAndTags[]; total: number }>;

  findById(id: number): Promise<ArticleWithAuthorAndTags | null>;

  createArticle(data: {
    title: string;
    content: string;
    imageUrl?: string; // NOVO
    authorId: number;
    tags?: string[];
  }): Promise<ArticleWithAuthorAndTags>;

  updateArticle(
    id: number,
    data: {
      title?: string;
      content?: string;
      imageUrl?: string; // NOVO
      tags?: string[];
    }
  ): Promise<ArticleWithAuthorAndTags | null>;
}
