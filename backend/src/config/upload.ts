import multer from "multer";
import path from "path";

import { Request } from 'express'; 

export const upload = multer({
  storage: multer.diskStorage({
   
    destination: (_req: Request, _file: Express.Multer.File, cb) => {
      cb(null, path.resolve(__dirname, "..", "..", "uploads"));
    },
  
    filename: (_req: Request, file: Express.Multer.File, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});