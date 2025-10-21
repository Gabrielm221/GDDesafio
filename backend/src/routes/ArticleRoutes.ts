// src/routes/ArticleRoutes.ts
import { Router } from 'express';
import { ArticleController } from '../controllers/ArticleController';
import { CommentController } from '../controllers/CommentController';
import { commentRoutes } from './CommentRoutes';

export function articleRoutes(articleController: ArticleController, commentController: CommentController): Router {
  const router = Router();
  
  //Rota de listagem principal 
  router.get('/', articleController.getArticles.bind(articleController));

  // Aninha as rotas de Comentários
  router.use('/:articleId/comments', commentRoutes(commentController));

  return router;
}