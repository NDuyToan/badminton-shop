import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

// Plain interface avoids ESLint `no-unsafe-assignment` caused by
// `@ts-nocheck` in Prisma-generated files.
export interface UserRecord {
  id: number;
  email: string;
  fullname: string;
  passwordHash: string;
  role: string;
  address: string;
  status: string;
  refreshTokenHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const userSafeSelect = {
  id: true,
  email: true,
  fullname: true,
  address: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data,
      select: userSafeSelect,
    });
  }

  async findAll() {
    return this.prismaService.user.findMany({
      select: userSafeSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: userSafeSelect,
    });
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByIdWithSecrets(id: number): Promise<UserRecord | null> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async updateRefreshToken(
    id: number,
    refreshTokenHash: string | null,
  ): Promise<UserRecord> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        refreshTokenHash,
      },
    });
  }
}
