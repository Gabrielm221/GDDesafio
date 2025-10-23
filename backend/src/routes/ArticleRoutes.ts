import { Router } from 'express';
import { ArticleController } from '../controllers/ArticleController';
import { CommentController } from '../controllers/CommentController';
import { commentRoutes } from './CommentRoutes';
import { authenticateToken } from '../middlewares/authMiddlewares'; // Middleware de Autenticação

export function articleRoutes(articleController: ArticleController, commentController: CommentController): Router {
  const router = Router();

  /**
   * @swagger
   * tags:
   * name: Articles
   * description: Gerenciamento e listagem de artigos e conteúdos.
   */

  /**
   * @swagger
   * /api/articles:
   * get:
   * tags: [Articles]
   * summary: Lista todos os artigos com opções de paginação e busca.
   * parameters:
   * - in: query
   * name: page
   * schema: { type: integer, default: 1 }
   * description: Número da página.
   * - in: query
   * name: pageSize
   * schema: { type: integer, default: 10 }
   * description: Número de itens por página.
   * - in: query
   * name: search
   * schema: { type: string }
   * description: Termo para busca por título ou conteúdo.
   * - in: query
   * name: tag
   * schema: { type: string }
   * description: Filtro por nome de tag.
   * responses:
   * 200:
   * description: Retorna a lista paginada de artigos.
   * 500:
   * description: Erro interno do servidor.
   */
  router.get('/', articleController.getArticles.bind(articleController));
  
  /**
   * @swagger
   * /api/articles/{id}:
   * get:
   * tags: [Articles]
   * summary: Retorna os detalhes de um artigo específico.
   * parameters:
   * - in: path
   * name: id
   * required: true
   * schema: { type: integer }
   * description: ID do artigo a ser buscado.
   * responses:
   * 200:
   * description: Detalhes completos do artigo.
   * 404:
   * description: Artigo não encontrado.
   */
  router.get('/:id', articleController.getArticleById.bind(articleController));
  
  /**
   * @swagger
   * /api/articles:
   * post:
   * tags: [Articles]
   * summary: Cria um novo artigo.
   * security:
   * - bearerAuth: []
   * requestBody:
   * required: true
   * content:
   * application/json:
   * schema:
   * type: object
   * required: [title, content]
   * properties:
   * title: { type: string, example: Configuração do Tailwind}
   * content: { type: string }
   * imageUrl: { type: string, format: url, description: URL opcional da imagem de capa. }
   * tags: { type: array, items: { type: string }, description: Lista de nomes de tags (ex: ["Frontend", "DevOps"]). }
   * responses:
   * 201: { description: Artigo criado com sucesso. }
   * 400: { description: Dados de entrada inválidos ou campos obrigatórios ausentes. }
   * 401: { description: Não autorizado (Token ausente ou inválido). }
   */
  router.post('/', authenticateToken, articleController.createArticle.bind(articleController));
  
  /**
   * @swagger
   * /api/articles/{id}:
   * put:
   * tags: [Articles]
   * summary: Atualiza totalmente um artigo existente.
   * security:
   * - bearerAuth: []
   * parameters:
   * - in: path
   * name: id
   * required: true
   * schema: { type: integer }
   * requestBody:
   * required: true
   * content:
   * application/json:
   * schema:
   * type: object
   * properties:
   * title: { type: string }
   * content: { type: string }
   * imageUrl: { type: string, format: url }
   * tags: { type: array, items: { type: string } }
   * responses:
   * 200: { description: Artigo atualizado com sucesso. }
   * 400: { description: Dados inválidos ou nenhum campo para atualização. }
   * 401: { description: Não autorizado (O usuário não é o dono ou o token é inválido). }
   * 404: { description: Artigo não encontrado. }
   */
  router.put('/:id', authenticateToken, articleController.updateArticle.bind(articleController));

  // Rotas Aninhadas de Comentários (Assumimos que CommentRoutes está documentado separadamente)
  router.use('/:articleId/comments', commentRoutes(commentController));

  return router;
}