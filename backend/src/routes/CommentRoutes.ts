// src/routes/CommentRoutes.ts
import { Router } from 'express';
import { CommentController } from '../controllers/CommentController';

// mergeParams: true é essencial para ler o :articleId do pai
export function commentRoutes(controller: CommentController): Router {
  const router = Router({ mergeParams: true });

  router.get('/', controller.getComments.bind(controller));
  router.post('/', controller.createComment.bind(controller));

  return router;
}
