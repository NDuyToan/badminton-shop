'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/auth-context';

export function AdminHeader() {
  const { user, logout, isLoggingOut } = useAuth();
  const pathname = usePathname();

  // Do not show header on auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return null;
  }

  const navItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Categories', href: '/categories' },
  ];

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              🏸
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-lg">
                Badminton Shop
              </span>
              <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-700/10">
                Admin
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: User profile badge & Logout */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-none">
                  {user.fullname}
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20">
                    {user.role}
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate max-w-[150px]">
                    {user.email}
                  </span>
                </div>
              </div>

              <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm border border-indigo-200 dark:border-indigo-800">
                {user.fullname?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            </div>
          )}

          <button
            onClick={() => void logout()}
            disabled={isLoggingOut}
            title="Đăng xuất"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 shadow-2xs hover:bg-red-50 hover:text-red-700 hover:border-red-200 dark:hover:bg-red-950/40 dark:hover:text-red-400 dark:hover:border-red-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoggingOut ? (
              <span>Đang thoát...</span>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Đăng xuất</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
