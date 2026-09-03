import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    register: jest.Mock;
    login: jest.Mock;
    refreshTokens: jest.Mock;
    logout: jest.Mock;
    getMe: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      refreshTokens: jest.fn(),
      logout: jest.fn(),
      getMe: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call authService.register', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      fullname: 'Test User',
      address: '123 Test St',
    };
    authService.register.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.register(dto);
    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(result).toHaveProperty('id', 1);
  });

  it('should call authService.login', async () => {
    const dto = { email: 'test@example.com', password: 'password123' };
    const expected = {
      accessToken: 'token',
      refreshToken: 'refresh',
      user: { id: 1 },
    };
    authService.login.mockResolvedValue(expected);

    const result = await controller.login(dto);
    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('should call authService.refreshTokens', async () => {
    const dto = { refreshToken: 'valid-refresh-token' };
    const expected = {
      accessToken: 'new-token',
      refreshToken: 'new-refresh',
      user: { id: 1 },
    };
    authService.refreshTokens.mockResolvedValue(expected);

    const result = await controller.refresh(dto);
    expect(authService.refreshTokens).toHaveBeenCalledWith(dto.refreshToken);
    expect(result).toEqual(expected);
  });

  it('should call authService.logout', async () => {
    authService.logout.mockResolvedValue({
      message: 'Logged out successfully',
    });

    const result = await controller.logout(1);
    expect(authService.logout).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: 'Logged out successfully' });
  });

  it('should call authService.getMe for getMe', async () => {
    const expectedUser = { id: 1, email: 'test@example.com' };
    authService.getMe.mockResolvedValue(expectedUser);

    const result = await controller.getMe(1);
    expect(authService.getMe).toHaveBeenCalledWith(1);
    expect(result).toEqual(expectedUser);
  });

  it('should call authService.getMe for getProfile', async () => {
    const expectedUser = { id: 1, email: 'test@example.com' };
    authService.getMe.mockResolvedValue(expectedUser);

    const result = await controller.getProfile(1);
    expect(authService.getMe).toHaveBeenCalledWith(1);
    expect(result).toEqual(expectedUser);
  });
});
