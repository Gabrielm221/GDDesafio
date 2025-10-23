import { PrismaClient, Prisma, User } from "@prisma/client";
import { IUserUpdate } from "../types/UserInterface"; // Interface necessária

export class UserRepository {
  constructor(private prisma: PrismaClient) {} // Injeção

  async create(dados: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ 
      data: dados, 
    });
  }

  async searchByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async list(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async searchById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } }); 
  }
  
  async update(userId: number, dados: IUserUpdate): Promise<User> {
    return this.prisma.user.update({ 
      where: { id: userId },
      data: dados,
    });
  }
}