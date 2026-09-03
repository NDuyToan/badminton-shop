import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    findByEmail: jest.Mock;
    create: jest.Mock;
    findById: jest.Mock;
    findByIdWithSecrets: jest.Mock;
    updateRefreshToken: jest.Mock;
  };
  let jwtService: {
    signAsync: jest.Mock;
    verifyAsync: jest.Mock;
  };
  let configService: {
    getOrThrow: jest.Mock;
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    fullname: 'Test User',
    address: '123 Test St',
    passwordHash: '$2b$10$hashedpassword',
    refreshTokenHash: '$2b$10$hashedrefreshtoken',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findByIdWithSecrets: jest.fn(),
      updateRefreshToken: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('test-token'),
      verifyAsync: jest.fn().mockResolvedValue({
        sub: 1,
        email: 'test@example.com',
        role: 'CUSTOMER',
      }),
    };

    configService = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'JWT_REFRESH_SECRET') return 'test_refresh_secret';
        if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
        return 'test_value';
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'new@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      fullname: 'New User',
      address: '456 New St',
    };

    it('should register a user successfully', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue({
        id: 2,
        email: registerDto.email,
        fullname: registerDto.fullname,
        address: registerDto.address,
        role: 'CUSTOMER',
        status: 'ACTIVE',
      });

      const result = await service.register(registerDto);
      expect(result).toHaveProperty('id', 2);
      expect(usersService.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is IN_ACTIVE', async () => {
      usersService.findByEmail.mockResolvedValue({
        ...mockUser,
        status: 'IN_ACTIVE',
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        'Account is inactive',
      );
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(service, 'verifyPassword').mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        'Email or password not match',
      );
    });

    it('should return tokens and safe user on successful login', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(service, 'verifyPassword').mockResolvedValue(true);
      jwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.user).not.toHaveProperty('refreshTokenHash');
      expect(usersService.updateRefreshToken).toHaveBeenCalled();
    });
  });

  describe('refreshTokens', () => {
    it('should throw UnauthorizedException when refresh token verification fails', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));

      await expect(service.refreshTokens('invalid-token')).rejects.toThrow(
        'Invalid or expired refresh token',
      );
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: 99 });
      usersService.findByIdWithSecrets.mockResolvedValue(null);

      await expect(service.refreshTokens('valid-token')).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw UnauthorizedException when user is IN_ACTIVE', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: 1 });
      usersService.findByIdWithSecrets.mockResolvedValue({
        ...mockUser,
        status: 'IN_ACTIVE',
      });

      await expect(service.refreshTokens('valid-token')).rejects.toThrow(
        'Account is inactive',
      );
    });

    it('should throw UnauthorizedException when user has no refreshTokenHash', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: 1 });
      usersService.findByIdWithSecrets.mockResolvedValue({
        ...mockUser,
        refreshTokenHash: null,
      });

      await expect(service.refreshTokens('valid-token')).rejects.toThrow(
        'Invalid or expired refresh token',
      );
    });

    it('should throw UnauthorizedException when token comparison fails', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: 1 });
      usersService.findByIdWithSecrets.mockResolvedValue(mockUser);
      jest.spyOn(service, 'verifyPassword').mockResolvedValue(false);

      await expect(service.refreshTokens('mismatched-token')).rejects.toThrow(
        'Invalid or expired refresh token',
      );
    });

    it('should return new token pair on successful refresh', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: 1 });
      usersService.findByIdWithSecrets.mockResolvedValue(mockUser);
      jest.spyOn(service, 'verifyPassword').mockResolvedValue(true);
      jwtService.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      const result = await service.refreshTokens('valid-token');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.user).not.toHaveProperty('refreshTokenHash');
      expect(usersService.updateRefreshToken).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear refresh token hash and return success message', async () => {
      usersService.updateRefreshToken.mockResolvedValue(mockUser);

      const result = await service.logout(1);

      expect(usersService.updateRefreshToken).toHaveBeenCalledWith(1, null);
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });

  describe('getMe', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findById.mockResolvedValue(null);

      await expect(service.getMe(1)).rejects.toThrow('User not found');
    });

    it('should throw UnauthorizedException if user is IN_ACTIVE', async () => {
      usersService.findById.mockResolvedValue({
        ...mockUser,
        status: 'IN_ACTIVE',
      });

      await expect(service.getMe(1)).rejects.toThrow('Account is inactive');
    });

    it('should return safe user if active', async () => {
      usersService.findById.mockResolvedValue(mockUser);

      const result = await service.getMe(1);
      expect(result).toEqual(mockUser);
    });
  });
});
