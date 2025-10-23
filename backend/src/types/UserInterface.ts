import { User } from "@prisma/client";

export interface IUserUpdate {
  name?: string;
  email?: string;
  password?: string;
  profilePictureUrl?: string;
  status?: boolean;
}

export interface IUserRepository {
  create: (dados: any) => Promise<User>;
  searchByEmail: (email: string) => Promise<User | null>;
  searchById: (id: number) => Promise<User | null>;
  // Tipagem correta usando o DTO do mesmo arquivo
  update: (userId: number, dados: IUserUpdate) => Promise<User>; 
}