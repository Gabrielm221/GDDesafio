import { Router } from 'express';
import { ArticleController } from '../controllers/ArticleController';
import { CommentController } from '../controllers/CommentController';
import { commentRoutes } from './CommentRoutes';

export function articleRoutes(articleController: ArticleController, commentController: CommentController): Router {
  const router = Router();

  router.get('/', articleController.getArticles.bind(articleController));
  router.get('/:id', articleController.getArticleById.bind(articleController));
  router.post('/', articleController.createArticle.bind(articleController));
  router.put('/:id', articleController.updateArticle.bind(articleController));

  router.use('/:articleId/comments', commentRoutes(commentController));

  return router;
}
