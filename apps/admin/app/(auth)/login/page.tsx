'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

import { loginAction } from '@/features/auth/actions/auth.actions';
import {
  loginSchema,
  type LoginSchemaValues,
} from '@/features/auth/schemas/auth.schema';
import { FormInput } from '@/components/common/form-input';
import { Button } from '@/components/ui/button';

function LoginFormContent() {
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get('registered') === '1';

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: LoginSchemaValues) => {
    setServerError(null);

    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);

    try {
      const result = await loginAction({ error: null }, formData);
      if (result?.error) {
        setServerError(result.error);
      }
    } catch (err) {
      // Next.js redirect() throws a NEXT_REDIRECT error on the client to perform navigation
      if (
        typeof err === 'object' &&
        err !== null &&
        'message' in err &&
        (err as { message?: string }).message?.includes('NEXT_REDIRECT')
      ) {
        throw err;
      }
      setServerError('Đăng nhập thất bại. Vui lòng kiểm tra lại kết nối và thử lại.');
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Đăng nhập quản trị
        </h2>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          Vui lòng nhập thông tin tài khoản có quyền{' '}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            ADMIN
          </span>
        </p>
      </div>

      {/* Success banner after registration */}
      {isRegistered && !serverError && (
        <div className="mb-5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-3.5 text-sm text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Đăng ký tài khoản thành công!</p>
            <p className="text-xs mt-0.5 text-emerald-700 dark:text-emerald-400">
              Vui lòng đăng nhập với thông tin bạn vừa tạo.
            </p>
          </div>
        </div>
      )}

      {/* Server error banner */}
      {serverError && (
        <div className="mb-5 rounded-lg bg-red-50 dark:bg-red-950/40 p-3.5 text-sm text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Lỗi đăng nhập</p>
            <p className="text-xs mt-0.5 text-red-600 dark:text-red-400">
              {serverError}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email Field with FormInput */}
        <FormInput
          name="email"
          type="email"
          control={control}
          label="Email quản trị"
          placeholder="admin@badmintonshop.com"
          requiredIndicator
          leftIcon={<Mail />}
          autoComplete="email"
        />

        {/* Password Field with FormInput */}
        <FormInput
          name="password"
          type="password"
          control={control}
          label="Mật khẩu"
          placeholder="••••••••"
          requiredIndicator
          leftIcon={<Lock />}
          showPasswordToggle
          autoComplete="current-password"
        />

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Đang xử lý đăng nhập..."
            className="w-full font-semibold"
          >
            Đăng nhập (Role ADMIN)
          </Button>
        </div>
      </form>

      <div className="mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-4 text-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Chưa có tài khoản quản trị?{' '}
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
          >
            Đăng ký tài khoản Admin mới
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-8 text-sm text-zinc-500">
          Đang tải trang đăng nhập...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
