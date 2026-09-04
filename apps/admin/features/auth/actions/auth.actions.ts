'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ApiError } from '@/lib/api-client';
import { authApi } from '../api/auth.api';
import { AuthActionState, LoginDto, RegisterDto } from '../types/auth.type';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

const isProduction = process.env.NODE_ENV === 'production';

// ─── Login ──────────────────────────────────────────────────────────────────

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const dto: LoginDto = {
    email: (formData.get('email') as string)?.trim(),
    password: formData.get('password') as string,
  };

  let response;
  try {
    response = await authApi.login(dto);
  } catch (err) {
    const message =
      err instanceof ApiError
        ? err.message
        : 'Đăng nhập thất bại. Vui lòng thử lại.';
    return { error: message };
  }

  // Role guard — only ADMIN may access this panel
  if (response.user.role !== 'ADMIN') {
    return {
      error:
        'Tài khoản không có quyền truy cập khu vực quản trị. Vui lòng liên hệ admin.',
    };
  }

  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN, response.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60 * 15, // 15 minutes — matches JWT_ACCESS_EXPIRES_IN
    path: '/',
  });

  cookieStore.set(REFRESH_TOKEN, response.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days — matches JWT_REFRESH_EXPIRES_IN
    path: '/',
  });

  redirect('/');
}

// ─── Register ────────────────────────────────────────────────────────────────

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return { error: 'Mật khẩu xác nhận không khớp.' };
  }

  const dto: RegisterDto = {
    email: (formData.get('email') as string)?.trim(),
    password,
    confirmPassword,
    fullname: (formData.get('fullname') as string)?.trim(),
    address: (formData.get('address') as string)?.trim(),
    role: 'ADMIN',
  };

  try {
    await authApi.register(dto);
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.';
    return { error: message };
  }

  // After register, auto login
  const loginDto: LoginDto = { email: dto.email, password: dto.password };

  let loginResponse;
  try {
    loginResponse = await authApi.login(loginDto);
  } catch {
    // Register succeeded but login failed — send to login page
    redirect('/login?registered=1');
  }

  if (loginResponse.user.role !== 'ADMIN') {
    // Account created but not yet ADMIN — redirect to login with info
    redirect('/login?registered=1');
  }

  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN, loginResponse.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60 * 15,
    path: '/',
  });

  cookieStore.set(REFRESH_TOKEN, loginResponse.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  redirect('/');
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

  if (accessToken) {
    try {
      await authApi.logout(accessToken);
    } catch {
      // Ignore errors — clear cookies regardless
    }
  }

  cookieStore.delete(ACCESS_TOKEN);
  cookieStore.delete(REFRESH_TOKEN);

  redirect('/login');
}
