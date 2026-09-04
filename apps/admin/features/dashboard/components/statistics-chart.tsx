'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'overview' | 'sales' | 'revenue';

interface StatPoint {
  date: string;
  dayLabel: string;
  revenue: number; // in millions or standard index 0 - 250
  orders: number;
}

const dataPoints: StatPoint[] = [
  { date: '29 Thg 8', dayLabel: '29 Th8', revenue: 175, orders: 110 },
  { date: '30 Thg 8', dayLabel: '30 Th8', revenue: 185, orders: 95 },
  { date: '31 Thg 8', dayLabel: '31 Th8', revenue: 165, orders: 120 },
  { date: '01 Thg 9', dayLabel: '01 Th9', revenue: 155, orders: 85 },
  { date: '02 Thg 9', dayLabel: '02 Th9', revenue: 170, orders: 105 },
  { date: '03 Thg 9', dayLabel: '03 Th9', revenue: 160, orders: 115 },
  { date: '04 Thg 9', dayLabel: '04 Th9', revenue: 235, orders: 165 },
];

export function StatisticsChart() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const yTicks = [250, 200, 150, 100, 50, 0];
  const maxY = 250;

  // SVG viewBox coordinates: width 700, height 220
  const width = 700;
  const height = 220;
  const paddingX = 20;
  const paddingY = 20;

  const pointsCount = dataPoints.length;
  const stepX = (width - paddingX * 2) / (pointsCount - 1);

  // Compute curve points for upper wave (Revenue)
  const revPoints = dataPoints.map((p, idx) => {
    const x = paddingX + idx * stepX;
    const y = paddingY + (height - paddingY * 2) * (1 - p.revenue / maxY);
    return { x, y };
  });

  // Compute curve points for lower wave (Orders)
  const ordPoints = dataPoints.map((p, idx) => {
    const x = paddingX + idx * stepX;
    const y = paddingY + (height - paddingY * 2) * (1 - (p.orders * 1.3) / maxY);
    return { x, y };
  });

  // Helper to generate smooth Catmull-Rom or cubic Bezier path
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const revLinePath = generateSmoothPath(revPoints);
  const revAreaPath = `${revLinePath} L ${revPoints[revPoints.length - 1].x} ${height - paddingY} L ${revPoints[0].x} ${height - paddingY} Z`;

  const ordLinePath = generateSmoothPath(ordPoints);

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs">
      {/* Header with Title and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Thống kê hoạt động (Statistics)
          </h3>
          <p className="text-xs text-slate-400 dark:text-zinc-400 mt-0.5">
            Biến động doanh thu & đơn hàng trực tuyến 7 ngày qua
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Tab buttons */}
          <div className="flex items-center bg-slate-100/90 dark:bg-zinc-800/80 p-1 rounded-xl">
            {(['overview', 'sales', 'revenue'] as TabType[]).map((tab) => {
              const labels: Record<TabType, string> = {
                overview: 'Tổng quan',
                sales: 'Doanh số',
                revenue: 'Doanh thu',
              };
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                    active
                      ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          {/* Date Range Selector Button */}
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>29 Thg 8 - 04 Thg 9</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative">
        {/* Tooltip header */}
        <div className="h-6 mb-2">
          {hoveredIndex !== null ? (
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-3 animate-in fade-in-50 duration-100">
              <span className="font-bold text-slate-800 dark:text-zinc-100">
                {dataPoints[hoveredIndex].date}:
              </span>
              <span>
                Doanh thu: <strong>{dataPoints[hoveredIndex].revenue}M ₫</strong>
              </span>
              <span className="text-sky-500">
                Đơn hàng: <strong>{dataPoints[hoveredIndex].orders} đơn</strong>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                Doanh thu (VND)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
                Số lượng đơn hàng
              </span>
            </div>
          )}
        </div>

        <div className="flex">
          {/* Y-axis Ticks */}
          <div className="flex flex-col justify-between pr-3 text-[11px] font-medium text-slate-400 dark:text-zinc-500 h-52 select-none">
            {yTicks.map((tick) => (
              <span key={tick} className="leading-none text-right w-7">
                {tick}
              </span>
            ))}
          </div>

          {/* SVG Wave Chart */}
          <div className="flex-1 relative h-52">
            {/* Background horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {yTicks.map((tick) => (
                <div
                  key={tick}
                  className="border-b border-slate-100 dark:border-zinc-800/80 w-full"
                />
              ))}
            </div>

            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Gradient Area under Revenue Line */}
              <path d={revAreaPath} fill="url(#indigoGradient)" />

              {/* Lower Orders Line */}
              <path
                d={ordLinePath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-300"
              />

              {/* Upper Revenue Line */}
              <path
                d={revLinePath}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeLinecap="round"
                className="transition-all duration-300"
              />

              {/* Interactive Data Points Circles */}
              {revPoints.map((pt, idx) => {
                const isHovered = hoveredIndex === idx;
                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Hover vertical line guide */}
                    {isHovered && (
                      <line
                        x1={pt.x}
                        y1={paddingY}
                        x2={pt.x}
                        y2={height - paddingY}
                        stroke="#818cf8"
                        strokeDasharray="4 4"
                        strokeWidth="1.5"
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : 4}
                      className={cn(
                        'fill-white dark:fill-zinc-900 stroke-indigo-600 transition-all duration-200',
                        isHovered ? 'stroke-[3]' : 'stroke-2'
                      )}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* X-axis Date labels */}
        <div className="flex pl-10 pr-2 justify-between mt-2.5 text-[11px] font-medium text-slate-400 dark:text-zinc-500 select-none">
          {dataPoints.map((item, idx) => (
            <span
              key={item.date}
              className={`text-center ${
                hoveredIndex === idx
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : ''
              }`}
            >
              {item.dayLabel}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
