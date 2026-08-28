import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { hashPassword } from 'src/common/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, confirmPassword, fullname, address } = registerDto;

    if (confirmPassword && password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashPw = await hashPassword(password);

    const newUser = await this.prismaService.user.create({
      data: {
        email,
        fullname,
        passwordHash: hashPw,
        address,
      },
      select: {
        id: true,
        email: true,
        fullname: true,
        address: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newUser;
  }
}
