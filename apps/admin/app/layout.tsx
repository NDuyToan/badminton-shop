import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { AuthProvider } from '@/features/auth/context/auth-context';
import { AdminShell } from '@/components/layout/admin-shell';
import { authApi } from '@/features/auth/api/auth.api';
import { AuthUser } from '@/features/auth/types/auth.type';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Badminton Shop — Admin Portal',
  description: 'Trang quản trị cửa hàng vợt cầu lông Badminton Shop',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  let initialUser: AuthUser | null = null;
  if (token) {
    try {
      initialUser = await authApi.getMe(token);
    } catch {
      // Token might be expired or invalid
      initialUser = null;
    }
  }

  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 selection:bg-indigo-500 selection:text-white">
        <AuthProvider initialUser={initialUser}>
          <AdminShell>{children}</AdminShell>
        </AuthProvider>
      </body>
    </html>
  );
}
