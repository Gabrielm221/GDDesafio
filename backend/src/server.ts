// src/server.ts
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

// Imports para Injeção de Dependência (DIP)
import { ArticleRepository } from './repository/ArticleRepository';
import { ArticleService } from './services/ArticleService';
import { ArticleController } from './controllers/ArticleController';

import { CommentRepository } from './repository/CommentRepository';
import { CommentService } from './services/CommentService';
import { CommentController } from './controllers/CommentController';

import { articleRoutes } from './routes/ArticleRoutes';

const port = Number(process.env.BACKEND_PORT) || 3000;
const app = express();
const cors = require('cors');
const prisma = new PrismaClient(); // Conexão com o DB

app.use(express.json());
app.use(cors()); // Habilita CORS para todas as rotas

// === INJEÇÃO DE DEPENDÊNCIA (POO) ===

// 1. Repositórios (Implementação de baixo nível)
const articleRepository = new ArticleRepository(prisma);
const commentRepository = new CommentRepository(prisma);

// 2. Serviços (Regra de Negócio de alto nível, depende das Interfaces)
// As interfaces IArticleRepository e ICommentRepository garantem o SOLID DIP/OCP
const articleService = new ArticleService(articleRepository);
const commentService = new CommentService(commentRepository);

// 3. Controllers (Manipulação de HTTP)
const articleController = new ArticleController(articleService);
const commentController = new CommentController(commentService);

// === REGISTRO DAS ROTAS ===
const articlesRouter = articleRoutes(articleController, commentController);
app.use('/api/articles', articlesRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('API de Compartilhamento de Artigos da Grão Direto rodando! 🚀');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
