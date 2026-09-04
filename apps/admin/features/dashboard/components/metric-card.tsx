import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
  icon: React.ReactNode;
  description?: string;
}

export function MetricCard({
  title,
  value,
  trend,
  trendDirection,
  icon,
  description,
}: MetricCardProps) {
  const isUp = trendDirection === 'up';

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs hover:shadow-md transition-shadow">
      {/* Top Icon in light rounded container */}
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-xl bg-slate-100/90 dark:bg-zinc-800/80 flex items-center justify-center text-slate-700 dark:text-zinc-200">
          {icon}
        </div>
      </div>

      {/* Title */}
      <div className="mt-4">
        <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
          {title}
        </span>
      </div>

      {/* Value & Trend */}
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {value}
        </h3>

        <div
          className={cn(
            'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
            isUp
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
          )}
        >
          {isUp ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          <span>{trend}</span>
        </div>
      </div>

      {description && (
        <p className="mt-2 text-[11px] text-slate-400 dark:text-zinc-500">
          {description}
        </p>
      )}
    </div>
  );
}
