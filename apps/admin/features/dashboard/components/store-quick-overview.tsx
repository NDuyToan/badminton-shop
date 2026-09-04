import React from 'react';
import Link from 'next/link';
import { FolderTree, Plus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { Category } from '@/features/categories/types/category.type';

interface StoreQuickOverviewProps {
  categories?: Category[];
}

export function StoreQuickOverview({ categories = [] }: StoreQuickOverviewProps) {
  const activeCategoriesCount = categories.filter((c) => c.status).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Category Management Card */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FolderTree className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {activeCategoriesCount} đang hoạt động
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-4">
            Quản lý Danh mục sản phẩm
          </h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
            Phân loại vợt cầu lông, giày, quấn cán, túi đựng và các dụng cụ thể thao chính hãng.
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <Link
            href="/categories"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group"
          >
            Quản lý danh mục
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <span className="text-[11px] text-slate-400">
            {categories.length} danh mục
          </span>
        </div>
      </div>

      {/* Featured Brands / Equipment */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              Chính hãng
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-4">
            Thương hiệu chủ lực
          </h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
            Yonex, Victor, Lining, Mizuno - Hệ thống tự động đồng bộ giá bán niêm yết và tồn kho.
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Kho hàng miền Bắc & Nam</span>
          <span className="text-xs font-semibold text-emerald-600">Sẵn sàng 100%</span>
        </div>
      </div>

      {/* System Security */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              An toàn & Bảo mật
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-4">
            Bảo mật & Phân quyền
          </h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
            Hệ thống xác thực JWT an toàn kết hợp cookie HttpOnly, bảo vệ giao dịch và dữ liệu khách hàng.
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Phiên bản Admin</span>
          <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">v2.1 TailAdmin</span>
        </div>
      </div>
    </div>
  );
}
