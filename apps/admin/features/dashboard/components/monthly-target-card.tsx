import React from 'react';
import { MoreVertical, ArrowUp, ArrowDown } from 'lucide-react';

interface MonthlyTargetCardProps {
  percentage?: number;
  target?: string;
  revenue?: string;
  today?: string;
}

export function MonthlyTargetCard({
  percentage = 75.55,
  target = '150.000.000₫',
  revenue = '113.325.000₫',
  today = '3.287.000₫',
}: MonthlyTargetCardProps) {
  // Arc length calculations for r = 85
  // Path: M 25 110 A 85 85 0 0 1 195 110 -> length = PI * 85 ~= 267.03
  const radius = 85;
  const arcLength = Math.PI * radius; // ~267.03
  const progressRatio = Math.min(Math.max(percentage / 100, 0), 1);
  const strokeDashoffset = arcLength * (1 - progressRatio);

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Mục tiêu tháng (Monthly Target)
          </h3>
          <p className="text-xs text-slate-400 dark:text-zinc-400 mt-0.5">
            Chỉ tiêu doanh số cửa hàng Badminton trong tháng 9
          </p>
        </div>
        <button
          type="button"
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Center Gauge */}
      <div className="flex flex-col items-center justify-center my-4">
        <div className="relative w-56 h-32 flex items-center justify-center">
          <svg
            viewBox="0 0 220 125"
            className="w-full h-full overflow-visible"
          >
            {/* Background Arc */}
            <path
              d="M 25 110 A 85 85 0 0 1 195 110"
              fill="none"
              stroke="currentColor"
              className="text-slate-100 dark:text-zinc-800"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Progress Arc */}
            <path
              d="M 25 110 A 85 85 0 0 1 195 110"
              fill="none"
              stroke="currentColor"
              className="text-indigo-600 dark:text-indigo-500 transition-all duration-1000 ease-out"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>

          {/* Value in Center */}
          <div className="absolute bottom-2 flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {percentage}%
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full mt-1 border border-emerald-200 dark:border-emerald-800">
              +10%
            </span>
          </div>
        </div>

        {/* Motivational Text */}
        <p className="text-xs text-center text-slate-500 dark:text-zinc-400 max-w-xs mt-3 leading-relaxed">
          Doanh thu hôm nay đạt <strong className="text-slate-800 dark:text-zinc-200">{today}</strong>, cao hơn mức trung bình tháng trước. Tiếp tục duy trì phong độ!
        </p>
      </div>

      {/* Bottom Breakdown Metrics */}
      <div className="grid grid-cols-3 pt-4 border-t border-slate-100 dark:border-zinc-800/80 text-center divide-x divide-slate-100 dark:divide-zinc-800">
        <div className="px-2">
          <span className="text-[11px] text-slate-400 dark:text-zinc-400 block font-medium">
            Mục tiêu
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center justify-center gap-0.5 mt-0.5 truncate">
            {target}
            <ArrowDown className="w-3 h-3 text-rose-500 shrink-0" />
          </span>
        </div>

        <div className="px-2">
          <span className="text-[11px] text-slate-400 dark:text-zinc-400 block font-medium">
            Doanh thu
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center justify-center gap-0.5 mt-0.5 truncate">
            {revenue}
            <ArrowUp className="w-3 h-3 text-emerald-500 shrink-0" />
          </span>
        </div>

        <div className="px-2">
          <span className="text-[11px] text-slate-400 dark:text-zinc-400 block font-medium">
            Hôm nay
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center justify-center gap-0.5 mt-0.5 truncate">
            {today}
            <ArrowUp className="w-3 h-3 text-emerald-500 shrink-0" />
          </span>
        </div>
      </div>
    </div>
  );
}
