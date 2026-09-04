'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  CheckCircle2,
  ChevronDown,
  LogOut,
  User,
  Settings,
  X,
  Package,
} from 'lucide-react';
import { useAuth } from '@/features/auth/context/auth-context';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export function AdminHeader({
  onToggleSidebar,
}: AdminHeaderProps) {
  const { user, logout, isLoggingOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Initialize theme from document or localStorage
  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Đơn hàng mới #ORD-8921',
      desc: 'Nguyễn Văn An vừa đặt 1 Vợt Yonex Astrox 77 Pro',
      time: '5 phút trước',
      unread: true,
    },
    {
      id: 2,
      title: 'Cảnh báo tồn kho vợt',
      desc: 'Lining Axforce 90 Max còn dưới 3 cây trong kho',
      time: '2 giờ trước',
      unread: true,
    },
    {
      id: 3,
      title: 'Cập nhật danh mục hoàn tất',
      desc: 'Danh mục "Phụ kiện quấn cán" đã được kích hoạt',
      time: '1 ngày trước',
      unread: false,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors">
        {/* Left: Hamburger & Search bar */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Đóng / Mở menu thanh bên"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Trigger Button */}
          <div
            onClick={() => setShowSearchModal(true)}
            className="relative flex items-center w-full max-w-md cursor-pointer group"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-hover:text-slate-600 dark:text-zinc-500 dark:group-hover:text-zinc-300 transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <div className="w-full pl-9 pr-12 py-2 text-xs sm:text-sm rounded-xl border border-slate-200/90 dark:border-zinc-800 bg-slate-50/70 hover:bg-slate-100/80 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/80 text-slate-400 dark:text-zinc-400 transition-all flex items-center justify-between">
              <span className="truncate">Tìm kiếm hoặc nhập lệnh...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white dark:bg-zinc-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-600 rounded-md shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Actions: Dark Mode, Notifications, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={isDarkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 transition-transform rotate-0 scale-100" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform rotate-0 scale-100" />
            )}
          </button>

          {/* Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Thông báo hệ thống"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-zinc-900" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl py-3 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Thông báo mới (3)
                  </h4>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">
                    Đánh dấu đã đọc
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-zinc-800 max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        'px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer flex gap-3',
                        notif.unread ? 'bg-indigo-50/20 dark:bg-indigo-950/20' : ''
                      )}
                    >
                      <div className="mt-0.5 h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 mt-0.5">
                          {notif.desc}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 block">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 pt-2 border-t border-slate-100 dark:border-zinc-800 text-center">
                  <Link
                    href="/orders"
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    onClick={() => setShowNotifications(false)}
                  >
                    Xem tất cả đơn hàng & thông báo &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative pl-1 sm:pl-2" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1 sm:px-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                {user?.fullname?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 leading-tight">
                  {user?.fullname || 'Admin User'}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-400 leading-none">
                  {user?.role || 'ADMIN'}
                </span>
              </div>
              <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl py-2 z-50 animate-in fade-in-50 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-zinc-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {user?.fullname || 'Quản trị viên'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">
                    {user?.email || 'admin@badminton.vn'}
                  </p>
                  <span className="inline-block mt-1.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {user?.role || 'ADMIN'}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/categories"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Package className="w-4 h-4 text-slate-400" />
                    Quản lý danh mục
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Cài đặt hệ thống
                  </Link>
                </div>

                <div className="border-t border-slate-100 dark:border-zinc-800 pt-1">
                  <button
                    type="button"
                    onClick={() => void logout()}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất tài khoản'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Search Modal (Cmd+K / Ctrl+K) */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div
            className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 border-b border-slate-100 dark:border-zinc-800">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm danh mục, đơn hàng, người dùng..."
                className="w-full py-4 px-3 text-sm bg-transparent outline-hidden text-slate-900 dark:text-white placeholder-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 text-xs space-y-1">
              <div className="px-3 py-1.5 text-slate-400 font-bold uppercase text-[10px]">
                Lối tắt điều hướng
              </div>
              <Link
                href="/categories"
                onClick={() => setShowSearchModal(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-zinc-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-600" />
                  Danh mục sản phẩm cầu lông
                </span>
                <span className="text-slate-400 text-[11px]">/categories</span>
              </Link>
              <Link
                href="/"
                onClick={() => setShowSearchModal(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-zinc-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  Bảng điều khiển eCommerce
                </span>
                <span className="text-slate-400 text-[11px]">/</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
