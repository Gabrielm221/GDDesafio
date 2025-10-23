import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const blacklist: string[] = [];

export function verifyToken(token: string): jwt.JwtPayload | string {
  if (blacklist.includes(token)) {
    throw new Error("Token inválido");
  }
  return jwt.verify(token, process.env.SECRET_JWT as string);
}

// Função para adicionar o token à blacklist
export function blackListToken(token: string): void {
  blacklist.push(token);
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
   res.status(401).json({ message: "Token não fornecido" });
   return;
  }

  try {
    if (!process.env.SECRET_JWT) throw new Error("SECRET_JWT não definido!");

    const decoded = jwt.verify(token, process.env.SECRET_JWT as string) as {
      id: number;
      email: string;
      name: string;
    };

    (req as any).user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
    return ;
  }
}