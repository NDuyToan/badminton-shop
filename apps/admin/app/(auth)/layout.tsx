import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block">
          <div className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              🏸
            </div>
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Badminton Shop
            </span>
          </div>
        </Link>
        <span className="ml-2 inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-400 ring-1 ring-inset ring-indigo-700/10">
          Admin Portal
        </span>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-zinc-900 py-8 px-6 sm:px-10 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
