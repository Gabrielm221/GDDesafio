import express, { Request, Response } from 'express';
import 'dotenv/config'; 

const app = express();
const port = +(process.env.PORT || 3000);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('API de Compartilhamento de Artigos da Grão Direto - Inicializando... 🚀');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});