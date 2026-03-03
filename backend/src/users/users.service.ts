import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    phone: string;
    role: Role;
  }) {
    return this.prisma.user.create({ data });
  }

  getProfile(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        phone: true,
      },
    });
  }

  updateProfile(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      birthDate?: Date;
      phone?: string;
    },
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        phone: true,
      },
    });
  }
}
