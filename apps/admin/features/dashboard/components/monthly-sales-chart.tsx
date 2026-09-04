'use client';

import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';

interface MonthlyData {
  month: string;
  value: number; // in millions VND or sales count
  orders: number;
}

const defaultData: MonthlyData[] = [
  { month: 'Jan', value: 160, orders: 120 },
  { month: 'Feb', value: 375, orders: 280 },
  { month: 'Mar', value: 195, orders: 150 },
  { month: 'Apr', value: 290, orders: 210 },
  { month: 'May', value: 180, orders: 135 },
  { month: 'Jun', value: 190, orders: 140 },
  { month: 'Jul', value: 285, orders: 215 },
  { month: 'Aug', value: 140, orders: 105 },
  { month: 'Sep', value: 210, orders: 160 },
  { month: 'Oct', value: 380, orders: 295 },
  { month: 'Nov', value: 270, orders: 200 },
  { month: 'Dec', value: 115, orders: 90 },
];

export function MonthlySalesChart() {
  const [hoveredItem, setHoveredItem] = useState<MonthlyData | null>(null);
  const maxValue = 400;
  const yTicks = [400, 300, 200, 100, 0];

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Doanh số theo tháng (Monthly Sales)
          </h3>
          <p className="text-xs text-slate-400 dark:text-zinc-400 mt-0.5">
            Phân bố doanh thu bán vợt & phụ kiện trong năm (Triệu VNĐ)
          </p>
        </div>
        <button
          type="button"
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Chart container */}
      <div className="relative pt-6">
        {/* Hover Tooltip display */}
        <div className="h-6 mb-2">
          {hoveredItem ? (
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 animate-in fade-in-50 duration-100">
              <span>{hoveredItem.month}:</span>
              <span className="text-slate-900 dark:text-white font-bold">
                {hoveredItem.value.toLocaleString()} Triệu ₫
              </span>
              <span className="text-slate-400 font-normal">
                ({hoveredItem.orders} đơn hàng)
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 dark:text-zinc-500">
              Rê chuột vào cột để xem chi tiết tháng
            </span>
          )}
        </div>

        <div className="flex">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between pr-3 text-[11px] font-medium text-slate-400 dark:text-zinc-500 h-48 select-none">
            {yTicks.map((tick) => (
              <span key={tick} className="leading-none text-right w-7">
                {tick}
              </span>
            ))}
          </div>

          {/* Grid lines and Bars */}
          <div className="flex-1 relative h-48 flex items-end">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {yTicks.map((tick) => (
                <div
                  key={tick}
                  className="border-b border-slate-100 dark:border-zinc-800/80 w-full"
                />
              ))}
            </div>

            {/* Bars */}
            <div className="relative z-10 w-full h-full flex items-end justify-between gap-1 sm:gap-2 px-1 sm:px-2">
              {defaultData.map((item) => {
                const heightPercent = (item.value / maxValue) * 100;
                const isHovered = hoveredItem?.month === item.month;

                return (
                  <div
                    key={item.month}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    onMouseEnter={() => setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[20px] rounded-t-sm sm:rounded-t-md transition-all duration-200 ${
                        isHovered
                          ? 'bg-indigo-500 shadow-md shadow-indigo-500/30'
                          : 'bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* X-axis Month labels */}
        <div className="flex pl-10 pr-1 sm:pr-2 justify-between mt-2.5 text-[11px] font-medium text-slate-400 dark:text-zinc-500 select-none">
          {defaultData.map((item) => (
            <span
              key={item.month}
              className={`flex-1 text-center truncate ${
                hoveredItem?.month === item.month
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : ''
              }`}
            >
              {item.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
