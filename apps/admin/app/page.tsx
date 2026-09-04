import { Users, PackageCheck } from "lucide-react";
import { authApi } from "@/features/auth/api/auth.api";
import { categoryApi } from "@/features/categories/api/category.api";
import { Category } from "@/features/categories/types/category.type";
import { MetricCard } from "@/features/dashboard/components/metric-card";
import { MonthlyTargetCard } from "@/features/dashboard/components/monthly-target-card";
import { MonthlySalesChart } from "@/features/dashboard/components/monthly-sales-chart";
import { StatisticsChart } from "@/features/dashboard/components/statistics-chart";
import { StoreQuickOverview } from "@/features/dashboard/components/store-quick-overview";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  let user = null;
  if (token) {
    try {
      user = await authApi.getMe(token);
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      user = null;
    }
  }

  let categories: Category[] = [];
  try {
    categories = await categoryApi.getCategories();
  } catch {
    categories = [
      {
        id: 1,
        name: "Vợt cầu lông Yonex",
        slug: "vot-cau-long-yonex",
        status: true,
        description: "Vợt thi đấu chuyên nghiệp công nghệ Nhật Bản",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Vợt cầu lông Victor & Lining",
        slug: "vot-victor-lining",
        status: true,
        description: "Dòng vợt công thủ toàn diện",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: "Giày cầu lông giảm chấn",
        slug: "giay-cau-long",
        status: true,
        description: "Bảo vệ gót và cổ chân tối đa",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 4,
        name: "Phụ kiện & Quấn cán vợt",
        slug: "phu-kien-quan-can",
        status: true,
        description: "Cước đan BG65, quấn cán hút mồ hôi",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Top Grid: Metric Cards + Monthly Sales (Left) & Monthly Target (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Section: 2 Metric Cards + Monthly Sales Bar Chart */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          {/* 2 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MetricCard
              title="Khách hàng (Customers)"
              value="3,782"
              trend="11.01%"
              trendDirection="up"
              icon={<Users className="w-5 h-5" />}
              description="Khách hàng hoạt động tháng này"
            />
            <MetricCard
              title="Đơn hàng (Orders)"
              value="5,359"
              trend="9.05%"
              trendDirection="down"
              icon={<PackageCheck className="w-5 h-5" />}
              description="Tổng đơn vợt & phụ kiện hoàn tất"
            />
          </div>

          {/* Monthly Sales Bar Chart */}
          <div className="flex-1">
            <MonthlySalesChart />
          </div>
        </div>

        {/* Right Section: Monthly Target Gauge Card */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          <MonthlyTargetCard
            percentage={75.55}
            target="150M ₫"
            revenue="113.3M ₫"
            today="3.28M ₫"
          />
        </div>
      </div>

      {/* Full-width Statistics Area Wave Chart */}
      <div>
        <StatisticsChart />
      </div>

      {/* Badminton Store Quick Overview & Actions */}
      <div>
        <StoreQuickOverview categories={categories} />
      </div>
    </div>
  );
}
