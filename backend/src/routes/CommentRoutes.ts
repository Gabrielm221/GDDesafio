import { Router } from 'express';
import { CommentController } from '../controllers/CommentController';
import { authenticateToken } from '../middlewares/authMiddlewares'; // Middleware de Autenticação

export function commentRoutes(controller: CommentController): Router {
  const router = Router({ mergeParams: true });

  /**
   * @swagger
   * tags:
   * name: Comments
   * description: Endpoints relacionados aos comentários e interações dos artigos.
   */

  /**
   * @swagger
   * /api/articles/{articleId}/comments:
   * get:
   * tags: [Comments]
   * summary: Lista todos os comentários (incluindo respostas) de um artigo específico.
   * parameters:
   * - in: path
   * name: articleId
   * required: true
   * schema:
   * type: integer
   * description: ID do artigo para buscar os comentários.
   * responses:
   * 200:
   * description: Lista de comentários de nível superior com suas respostas aninhadas.
   * content:
   * application/json:
   * schema:
   * type: array
   * items:
   * $ref: '#/components/schemas/CommentWithReplies'
   * 400:
   * description: ID do artigo inválido.
   */
  router.get('/', controller.getComments.bind(controller));
  
  /**
   * @swagger
   * /api/articles/{articleId}/comments:
   * post:
   * tags: [Comments]
   * summary: Cria um novo comentário ou uma resposta.
   * security:
   * - bearerAuth: []
   * parameters:
   * - in: path
   * name: articleId
   * required: true
   * schema:
   * type: integer
   * description: ID do artigo sendo comentado.
   * requestBody:
   * required: true
   * content:
   * application/json:
   * schema:
   * type: object
   * required:
   * - content
   * properties:
   * content:
   * type: string
   * example: Ótimo artigo! Concordo plenamente com a abordagem.
   * parentId:
   * type: integer
   * nullable: true
   * description: ID do comentário pai, se for uma resposta.
   * responses:
   * 201:
   * description: Comentário criado com sucesso.
   * 400:
   * description: Conteúdo muito curto ou ID de artigo inválido.
   * 401:
   * description: Não autorizado (token ausente ou inválido).
   */
  router.post('/', authenticateToken, controller.createComment.bind(controller)); 

  return router;
}
