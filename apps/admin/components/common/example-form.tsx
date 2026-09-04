"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormInput } from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, CheckCircle2 } from "lucide-react";

// 1. Define schema with Zod
const exampleSchema = z.object({
  fullName: z
    .string()
    .min(1, "Vui lòng nhập họ và tên")
    .min(3, "Họ và tên phải có ít nhất 3 ký tự"),
  email: z
    .string()
    .min(1, "Vui lòng nhập địa chỉ email")
    .email("Định dạng email không hợp lệ (ví dụ: admin@badmintonshop.com)"),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải chứa ít nhất 6 ký tự"),
});

type ExampleFormData = z.infer<typeof exampleSchema>;

export function ExampleForm() {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState<ExampleFormData | null>(null);

  // 2. Setup React Hook Form with Zod resolver
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ExampleFormData>({
    resolver: zodResolver(exampleSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onSubmit", // Validates on submit, can also be onBlur
  });

  const onSubmit = async (data: ExampleFormData) => {
    setIsSuccess(false);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmittedData(data);
    setIsSuccess(true);
  };

  const handleReset = () => {
    reset();
    setIsSuccess(false);
    setSubmittedData(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Demo FormInput & Button (Shadcn + RHF + Zod)
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Bấm Submit để kích hoạt lỗi validation (viền đỏ + chữ đỏ). Khi gõ ký tự tiếp theo, trạng thái lỗi sẽ tự động biến mất và trở về bình thường.
        </p>
      </div>

      {isSuccess && submittedData && (
        <div className="mb-5 p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-sm flex items-start gap-2.5 animate-in fade-in-50">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Xác thực hợp lệ và gửi thành công!</p>
            <p className="text-xs mt-0.5 font-mono text-emerald-700 dark:text-emerald-400">
              Email: {submittedData.email} | Tên: {submittedData.fullName}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name Field */}
        <FormInput
          name="fullName"
          control={control}
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          requiredIndicator
          leftIcon={<User />}
          description="Tên hiển thị trong bảng điều khiển quản trị"
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
        />

        <div className="pt-2 flex items-center gap-3">
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Đang xử lý..."
            className="flex-1"
          >
            Xác nhận (Submit)
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Đặt lại
          </Button>
        </div>
      </form>
    </div>
  );
}
