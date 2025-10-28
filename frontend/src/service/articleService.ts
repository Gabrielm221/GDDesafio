import api from './api';
import type { PaginatedArticles, Article, IArticleForm } from '../types'; 


// RETORNAMOS UMA ESTRUTURA PADRÃO DE PAGINAÇÃO
function normalizeResponse(data: any, params?: Record<string, any>): PaginatedArticles {

    if (data?.meta?.totalItems !== undefined) {
        return { data: data.data || [], meta: data.meta };
    }
    return { data: data.data || [], meta: { page: 1, pageCount: 1, total: 0 } };
}

export const articleService = {
  
  async list(params?: Record<string, any>): Promise<PaginatedArticles> {
    const res = await api.get('/api/articles', { params });
    //1. USAMOS NOSMALIZE PARA LIDAR COM A RESPOSTA.
    return normalizeResponse(res.data, params);
  },
  
  // 2. BUSCA DETALHADA (GET /api/articles/:id)
  async get(id: string): Promise<Article> {
    const res = await api.get<Article>(`/api/articles/${id}`);
    return res.data;
  },

  // 3. CRIAÇÃO (POST /api/articles)
  async createArticle(data: IArticleForm & { authorId: number }): Promise<Article> {
    // ATENÇÃO: Adicione o token de autenticação, pois esta rota deve ser protegida.
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Autenticação necessária para criar artigo.');

    const res = await api.post<Article>('/api/articles', data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // 4. EDIÇÃO (PUT /api/articles/:id)
  async updateArticle(id: number | string, data: Partial<IArticleForm>): Promise<Article> {
    //AQUI ENVIAMOS O NOSSO TOKEN, PARA PERMITIR A EDICAO DO ARTIGO, E TAMBEM O ID QUE VAI SER PEGO QUANDO CLICAMOS NO BOTAO DE EDITAR NO CARD
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Autenticação necessária para editar artigo.');

    const res = await api.put<Article>(`/api/articles/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
};