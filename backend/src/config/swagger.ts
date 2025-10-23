import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import swaggerFile from '../../swagger-output.json';

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
}
