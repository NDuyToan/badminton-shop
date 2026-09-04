'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderTree,
  ShoppingBag,
  ShoppingCart,
  Users,
  TrendingUp,
  ShieldCheck,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: 'primary' | 'success' | 'warning' | 'neutral';
  subItems?: { label: string; href: string }[];
}

export function AdminSidebar({
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [dashboardOpen, setDashboardOpen] = React.useState(true);

  const mainNavItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      subItems: [
        { label: 'Tổng quan eCommerce', href: '/' },
      ],
    },
    {
      label: 'Danh mục sản phẩm',
      href: '/categories',
      icon: FolderTree,
    },
    {
      label: 'Sản phẩm & Vợt',
      href: '/products',
      icon: ShoppingBag,
      badge: 'Mới',
      badgeVariant: 'success',
    },
    {
      label: 'Đơn hàng',
      href: '/orders',
      icon: ShoppingCart,
      badge: '5',
      badgeVariant: 'primary',
    },
    {
      label: 'Khách hàng',
      href: '/customers',
      icon: Users,
    },
    {
      label: 'Báo cáo doanh số',
      href: '/analytics',
      icon: TrendingUp,
    },
  ];

  const systemNavItems: NavItem[] = [
    {
      label: 'Tài khoản & Phân quyền',
      href: '/users',
      icon: ShieldCheck,
    },
    {
      label: 'Cấu hình cửa hàng',
      href: '/settings',
      icon: Settings,
    },
  ];

  const renderBadge = (badge?: string, variant: NavItem['badgeVariant'] = 'neutral') => {
    if (!badge || isCollapsed) return null;

    const variantStyles = {
      primary: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800',
      success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
      warning: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
      neutral: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    };

    return (
      <span
        className={cn(
          'ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
          variantStyles[variant]
        )}
      >
        {badge}
      </span>
    );
  };

  const isRouteActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-slate-200/80 dark:border-zinc-800 transition-all duration-300">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-zinc-800/80">
        <Link
          href="/"
          className="flex items-center gap-3 overflow-hidden focus:outline-hidden"
          title="Badminton Shop Admin"
        >
          <div className="h-9 w-9 min-w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
            🏸
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base leading-tight">
                Badminton<span className="text-indigo-600 dark:text-indigo-400 font-bold ml-1">Admin</span>
              </span>
              <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-400 leading-none">
                Bảng quản trị cửa hàng
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-zinc-800 md:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {/* Main Section */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-wider">
              MENU
            </div>
          )}

          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const active = isRouteActive(item.href);
              const Icon = item.icon;
              const hasSub = !!item.subItems && item.subItems.length > 0;

              if (item.href === '/' && hasSub) {
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => !isCollapsed && setDashboardOpen(!dashboardOpen)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer',
                        active
                          ? 'bg-indigo-50/80 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold'
                          : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon
                        className={cn(
                          'w-5 h-5 min-w-5 transition-colors',
                          active
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-400 group-hover:text-slate-600 dark:text-zinc-400 dark:group-hover:text-zinc-200'
                        )}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="truncate">{item.label}</span>
                          <span className="ml-auto">
                            {dashboardOpen ? (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                          </span>
                        </>
                      )}
                    </button>

                    {/* Submenu */}
                    {!isCollapsed && dashboardOpen && (
                      <div className="pl-9 pr-2 space-y-1">
                        {item.subItems?.map((sub) => {
                          const subActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={cn(
                                'block py-1.5 px-3 rounded-lg text-xs font-medium transition-colors',
                                subActive
                                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/50 dark:bg-indigo-950/30'
                                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                              )}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                    active
                      ? 'bg-indigo-50/80 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 min-w-5 transition-colors',
                      active
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 group-hover:text-slate-600 dark:text-zinc-400 dark:group-hover:text-zinc-200'
                    )}
                  />
                  {!isCollapsed && (
                    <>
                      <span className="truncate">{item.label}</span>
                      {renderBadge(item.badge, item.badgeVariant)}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Section */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-wider">
              HỆ THỐNG
            </div>
          )}

          <nav className="space-y-1">
            {systemNavItems.map((item) => {
              const active = isRouteActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                    active
                      ? 'bg-indigo-50/80 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 min-w-5 transition-colors',
                      active
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 group-hover:text-slate-600 dark:text-zinc-400 dark:group-hover:text-zinc-200'
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer / Support Promo */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800/80">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/20 border border-indigo-100/80 dark:border-indigo-900/40">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold">Badminton Pro Store</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
              Hệ thống vận hành phân phối vợt & phụ kiện chính hãng 2026.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:block fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Mobile Drawer Sheet */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 md:hidden transition-transform duration-300 ease-in-out transform',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}
