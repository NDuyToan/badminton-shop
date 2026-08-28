import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { comparePassword, hashPassword } from 'src/common/utils';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullname, address } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const passwordHash = await hashPassword(password);

    return this.usersService.create({
      email,
      fullname,
      passwordHash,
      address,
    });
  }

  async verifyPassword(password: string, passwordHash: string) {
    return comparePassword(password, passwordHash);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Email or password not match');
    }

    const isMatchPassword = await this.verifyPassword(
      password,
      user.passwordHash,
    );

    if (!isMatchPassword) {
      throw new UnauthorizedException('Email or password not match');
    }

    return user;
  }
}
