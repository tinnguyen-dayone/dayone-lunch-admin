import { Banknote, ShoppingBag, Users } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { StatsCard } from "@/components/stats-card";
import { PaymentsChart } from "@/components/payments-chart";
import { PriceAnalysisChart } from "@/components/price-analysis-chart";
import { getDashboardStats } from "@/services/dashboard";
import { TopUnpaidUsers } from "@/components/top-unpaid-users";

export const dynamic = "force-dynamic";

export default async function Page() {
  const stats = await getDashboardStats();

  return (
    <section>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <StatsCard
            title="Total Orders Today"
            value={stats.totalOrdersToday.toString()}
            icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
          />
          <StatsCard
            title="Average Order Value"
            value={stats.averageOrderValue} // Remove the $ prefix since formatVND handles it
            icon={<Banknote className="h-4 w-4 text-muted-foreground" />}
          />
          <StatsCard
            title="Active Customers"
            value={stats.activeCustomers.toString()}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <PaymentsChart />
          <PriceAnalysisChart />
        </div>
        <TopUnpaidUsers />
      </div>
    </section>
  );
}
