import Link from 'next/link';
import { cookies } from 'next/headers';
import { authApi } from '@/features/auth/api/auth.api';

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  let user = null;
  if (token) {
    try {
      user = await authApi.getMe(token);
    } catch {
      user = null;
    }
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-indigo-100 ring-1 ring-inset ring-white/20">
            <span>🛡️ Quyền truy cập:</span>
            <span className="font-bold tracking-wide uppercase">
              {user?.role || 'ADMIN'}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Xin chào, {user?.fullname || 'Quản trị viên'}! 👋
          </h1>

          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Chào mừng bạn đến với bảng điều khiển trung tâm Badminton Shop. Tại
            đây bạn có thể quản lý danh mục, sản phẩm, đơn hàng và các hoạt động
            của hệ thống.
          </p>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/categories"
          className="group block rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📁
            </div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Quản lý &rarr;
            </span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            Quản lý Danh mục
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Xem danh sách, thêm, chỉnh sửa và cấu hình trạng thái các danh mục sản phẩm vợt cầu lông.
          </p>
        </Link>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm opacity-60">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl">
              🏸
            </div>
            <span className="text-xs font-medium text-zinc-400">Sắp ra mắt</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            Quản lý Sản phẩm
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Quản lý vợt cầu lông, giày, phụ kiện, số lượng tồn kho và mức giá niêm yết.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm opacity-60">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl">
              📦
            </div>
            <span className="text-xs font-medium text-zinc-400">Sắp ra mắt</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            Quản lý Đơn hàng
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Theo dõi trạng thái giao dịch, xử lý xuất kho và đơn hàng của khách hàng.
          </p>
        </div>
      </div>
    </div>
  );
}
