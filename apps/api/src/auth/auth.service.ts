import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignOptions } from 'jsonwebtoken';

import { RegisterDto } from './dto/register.dto';
import { UsersService, UserRecord } from 'src/users/users.service';
import { comparePassword, hashPassword } from 'src/common/utils';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedUser } from './decorators/user.decorator';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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

  async generateTokens(user: { id: number; email: string; role: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_REFRESH_EXPIRES_IN',
        ) as SignOptions['expiresIn'],
      }),
    ]);

    const refreshTokenHash = await hashPassword(refreshToken);
    await this.usersService.updateRefreshToken(user.id, refreshTokenHash);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email or password not match');
    }

    if (user.status === 'IN_ACTIVE') {
      throw new UnauthorizedException('Account is inactive');
    }

    const isMatchPassword = await this.verifyPassword(
      password,
      user.passwordHash,
    );

    if (!isMatchPassword) {
      throw new UnauthorizedException('Email or password not match');
    }

    const tokens = await this.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash: _, refreshTokenHash: __, ...safeUser } = user;

    return {
      ...tokens,
      user: safeUser,
    };
  }

  async refreshTokens(refreshToken: string) {
    let payload: AuthenticatedUser;
    try {
      payload = await this.jwtService.verifyAsync<AuthenticatedUser>(
        refreshToken,
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findByIdWithSecrets(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const typedUser: UserRecord = user;

    if (typedUser.status === 'IN_ACTIVE') {
      throw new UnauthorizedException('Account is inactive');
    }

    const refreshTokenHash = typedUser.refreshTokenHash;
    if (!refreshTokenHash) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const isMatch = await this.verifyPassword(refreshToken, refreshTokenHash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokens = await this.generateTokens({
      id: typedUser.id,
      email: typedUser.email,
      role: typedUser.role,
    });

    const { passwordHash: _, refreshTokenHash: __, ...safeUser } = typedUser;

    return {
      ...tokens,
      user: safeUser,
    };
  }

  async logout(userId: number) {
    await this.usersService.updateRefreshToken(userId, null);
    return {
      message: 'Logged out successfully',
    };
  }

  async getMe(userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status === 'IN_ACTIVE') {
      throw new UnauthorizedException('Account is inactive');
    }

    return user;
  }
}
