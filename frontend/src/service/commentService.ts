import api from './api';
import type { Comment } from '../types';


interface PostCommentData {
  content: string;
  parentId?: number | null; 
}

export const commentService = {
  /**
   * LISTA TODOS OS COMENTÁRIOS DE UM ARTIGO
   */
  async listByArticle(articleId: string): Promise<Comment[]> {
    try {
      const res = await api.get(`/api/articles/${articleId}/comments`);
      return res.data as Comment[];
    } catch (err: any) {
      if (err?.response?.status === 404) {
        return [];
      }
      throw new Error('Falha ao buscar comentários.');
    }
  },

  /**
   * CRIA UM NOVO COMENTARIO PRINCIPAL PARA UM ARTIGO, OU UMA RESPOSTA A UM COMENTÁRIO EXISTENTE.
   */
  async createComment(
    articleId: string,
    data: PostCommentData,
    token: string
  ): Promise<Comment> {
    if (!token) {
      throw new Error('Token de autenticação ausente. Falha interna.');
    }

    try {
      const res = await api.post<Comment>(
        `/api/articles/${articleId}/comments`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || 'Erro ao enviar o comentário.';
      throw new Error(errorMessage);
    }
  },

  /**
   * CRIA UMA RESPOSTA A OUTRO COMENTARIO EXISTENTE.
   */
  async replyToComment(
    articleId: string,
    parentId: number,
    content: string,
    token: string
  ): Promise<Comment> {
    return await this.createComment(articleId, { content, parentId }, token);
  },
};
