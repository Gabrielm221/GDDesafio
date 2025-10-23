import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config'; 
import cors from 'cors'; 
import swaggerUi from 'swagger-ui-express';
// REPOSITORIES (Dependem do Prisma) 
import { ArticleRepository } from './repository/ArticleRepository';
import { CommentRepository } from './repository/CommentRepository';
import { UserRepository } from './repository/UserRepository'; 
// SERVICES (Dependem dos Repositórios) 
import { ArticleService } from './services/ArticleService';
import { CommentService } from './services/CommentService';
import { UserService } from './services/UserService'; 
// CONTROLLERS (Dependem dos Services) 
import { ArticleController } from './controllers/ArticleController';
import { CommentController } from './controllers/CommentController';
import { UserController } from './controllers/UserController'; 
// ROTAS 
import { articleRoutes } from './routes/ArticleRoutes'; 
import { userRoutes } from './routes/UserRoutes'; 

import { setupSwagger } from '../src/config/swagger';

// ===================================

const port = Number(process.env.PORT || process.env.BACKEND_PORT) || 3000; 
const app = express();
const prisma = new PrismaClient(); 

setupSwagger(app);

const corsOptions: cors.CorsOptions = {
  
  origin: '*', 
  
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
 
  credentials: true, 
};

app.use(cors(corsOptions)); 
app.use(express.json()); 

//INJEÇÃO DE DEPENDÊNCIA 
const articleRepository = new ArticleRepository(prisma);
const commentRepository = new CommentRepository(prisma);
const userRepository = new UserRepository(prisma); 

// 2. Serviços
const articleService = new ArticleService(articleRepository);
const commentService = new CommentService(commentRepository);
const userService = new UserService(userRepository); 

// 3. Controllers
const articleController = new ArticleController(articleService);
const commentController = new CommentController(commentService);
const userController = new UserController(userService); 

//REGISTRO DAS ROTAS 
const articlesRouter = articleRoutes(articleController, commentController);
app.use('/api/articles', articlesRouter); 

const usersRouter = userRoutes(userController); 
app.use('/api/users', usersRouter); 

// Rota de Saúde
app.get('/', (req: Request, res: Response) => {
  res.send('API de Artigos da Grão Direto rodando.');
});

// INICIALIZAÇÃO DO SERVIDOR
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});