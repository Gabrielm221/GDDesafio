import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middlewares/authMiddlewares';
import { upload } from '../config/upload';

export function userRoutes(userController: UserController): Router {
  const router = Router();

  /**
   * @swagger
   * tags:
   * name: Users
   * description: Endpoints relacionados ao gerenciamento e autenticação de usuários.
   */

  /**
   * @swagger
   * /users/create:
   * post:
   * tags: [Users]
   * summary: Cria um novo usuário no sistema.
   * requestBody:
   * required: true
   * content:
   * application/json:
   * schema:
   * type: object
   * required:
   * - name
   * - email
   * - password
   * properties:
   * name:
   * type: string
   * example: Gabriel da Silva
   * email:
   * type: string
   * format: email
   * example: gabriel.silva@graodireto.com
   * password:
   * type: string
   * format: password
   * example: MinhaSenhaSegura123
   * responses:
   * 201:
   * description: Usuário criado com sucesso.
   * 400:
   * description: Dados inválidos ou email já cadastrado.
   */
  router.post('/create', userController.create.bind(userController));

  /**
   * @swagger
   * /users/login:
   * post:
   * tags: [Users]
   * summary: Realiza o login e retorna um Token JWT.
   * requestBody:
   * required: true
   * content:
   * application/json:
   * schema:
   * type: object
   * required:
   * - email
   * - password
   * properties:
   * email:
   * type: string
   * format: email
   * example: gabriel.silva@graodireto.com
   * password:
   * type: string
   * format: password
   * example: MinhaSenhaSegura123
   * responses:
   * 200:
   * description: Login bem-sucedido. Retorna o Token JWT.
   * content:
   * application/json:
   * schema:
   * type: object
   * properties:
   * token:
   * type: string
   * example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   * 401:
   * description: Credenciais inválidas.
   */
  router.post('/login', userController.login.bind(userController));

  /**
   * @swagger
   * /users/logout:
   * post:
   * tags: [Users]
   * summary: Faz logout do usuário, invalidando o token.
   * security:
   * - bearerAuth: []
   * responses:
   * 200:
   * description: Logout realizado com sucesso!
   * 401:
   * description: Token inválido ou não fornecido.
   */
  router.post('/logout', userController.logout.bind(userController));

  /**
   * @swagger
   * /users/logado:
   * get:
   * tags: [Users]
   * summary: Retorna os dados do usuário logado (perfil).
   * security:
   * - bearerAuth: []
   * responses:
   * 200:
   * description: Retorna os dados do usuário logado (sem a senha).
   * 401:
   * description: Token inválido ou não fornecido.
   */
  router.get('/logado', authenticateToken, userController.getLoggedUser.bind(userController));

  /**
   * @swagger
   * /users/edit/{id}:
   * put:
   * tags: [Users]
   * summary: Atualiza dados do usuário logado, incluindo a foto de perfil.
   * security:
   * - bearerAuth: []
   * parameters:
   * - in: path
   * name: id
   * required: true
   * schema:
   * type: integer
   * description: ID do usuário a ser atualizado (deve coincidir com o token).
   * requestBody:
   * required: true
   * content:
   * multipart/form-data:
   * schema:
   * type: object
   * properties:
   * name:
   * type: string
   * password:
   * type: string
   * format: password
   * profilePictureUrl:
   * type: string
   * format: binary
   * description: Arquivo de imagem para o perfil.
   * responses:
   * 200:
   * description: Usuário atualizado com sucesso.
   * 400:
   * description: Dados de atualização inválidos.
   * 401:
   * description: Não autorizado (token ausente ou inválido).
   * 404:
   * description: Usuário não encontrado.
   */
  router.put(
    '/edit/:id',
    authenticateToken,
    upload.single('profilePictureUrl'),
    userController.update.bind(userController)
  );

  return router;
}
