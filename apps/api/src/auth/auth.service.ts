import { ConflictException, Injectable } from '@nestjs/common';

import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { hashPassword } from 'src/common/utils';

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
}
