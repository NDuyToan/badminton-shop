import * as z from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập email quản trị')
    .email('Định dạng email không hợp lệ (ví dụ: admin@badmintonshop.com)'),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type LoginSchemaValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullname: z
      .string()
      .min(1, 'Vui lòng nhập họ và tên')
      .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
      .max(100, 'Họ và tên không được vượt quá 100 ký tự'),
    email: z
      .string()
      .min(1, 'Vui lòng nhập email quản trị')
      .email('Định dạng email không hợp lệ (ví dụ: admin@badmintonshop.com)'),
    address: z
      .string()
      .min(1, 'Vui lòng nhập địa chỉ liên hệ'),
    password: z
      .string()
      .min(1, 'Vui lòng nhập mật khẩu')
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z
      .string()
      .min(1, 'Vui lòng nhập lại mật khẩu xác nhận'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp với mật khẩu đã nhập',
    path: ['confirmPassword'],
  });

export type RegisterSchemaValues = z.infer<typeof registerSchema>;
