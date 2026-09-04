'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, MapPin, Lock, AlertCircle } from 'lucide-react';

import { registerAction } from '@/features/auth/actions/auth.actions';
import {
  registerSchema,
  type RegisterSchemaValues,
} from '@/features/auth/schemas/auth.schema';
import { FormInput } from '@/components/common/form-input';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterSchemaValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: '',
      email: '',
      address: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: RegisterSchemaValues) => {
    setServerError(null);

    const formData = new FormData();
    formData.append('fullname', values.fullname);
    formData.append('email', values.email);
    formData.append('address', values.address);
    formData.append('password', values.password);
    formData.append('confirmPassword', values.confirmPassword);

    try {
      const result = await registerAction({ error: null }, formData);
      if (result?.error) {
        setServerError(result.error);
      }
    } catch (err) {
      // Next.js redirect() throws a NEXT_REDIRECT error on the client
      if (
        typeof err === 'object' &&
        err !== null &&
        'message' in err &&
        (err as { message?: string }).message?.includes('NEXT_REDIRECT')
      ) {
        throw err;
      }
      setServerError('Đăng ký thất bại. Vui lòng kiểm tra lại kết nối và thử lại.');
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Đăng ký Quản trị viên
        </h2>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          Tạo tài khoản mới với vai trò{' '}
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
            ADMIN
          </span>
        </p>
      </div>

      {/* Server error banner */}
      {serverError && (
        <div className="mb-5 rounded-lg bg-red-50 dark:bg-red-950/40 p-3.5 text-sm text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Lỗi đăng ký</p>
            <p className="text-xs mt-0.5 text-red-600 dark:text-red-400">
              {serverError}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Fullname Field */}
        <FormInput
          name="fullname"
          control={control}
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          requiredIndicator
          leftIcon={<User />}
          autoComplete="name"
        />

        {/* Email Field */}
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

        {/* Address Field */}
        <FormInput
          name="address"
          control={control}
          label="Địa chỉ"
          placeholder="Hà Nội, Việt Nam"
          requiredIndicator
          leftIcon={<MapPin />}
          autoComplete="street-address"
        />

        {/* Password Field */}
        <FormInput
          name="password"
          type="password"
          control={control}
          label="Mật khẩu"
          placeholder="Tối thiểu 6 ký tự"
          requiredIndicator
          leftIcon={<Lock />}
          showPasswordToggle
          autoComplete="new-password"
        />

        {/* Confirm Password Field */}
        <FormInput
          name="confirmPassword"
          type="password"
          control={control}
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          requiredIndicator
          leftIcon={<Lock />}
          showPasswordToggle
          autoComplete="new-password"
        />

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Đang tạo tài khoản Admin..."
            className="w-full font-semibold"
          >
            Đăng ký quyền ADMIN
          </Button>
        </div>
      </form>

      <div className="mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-4 text-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Đã có tài khoản quản trị?{' '}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
