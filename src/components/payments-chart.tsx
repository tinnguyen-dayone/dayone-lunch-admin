"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { TimeFrame, fetchTransactionStats } from "@/lib/data";
import { useEffect, useState } from "react";

export function PaymentsChart() {
  const [period, setPeriod] = useState<TimeFrame>("week");
  const [data, setData] = useState<{ day: string; transactions: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const transactions = await fetchTransactionStats(period);
        setData(transactions);
      } catch (error) {
        console.error("Failed to fetch transaction data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const formatDay = (day: string) => {
    if (period === "week") {
      return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    }
    return day;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            {period === "week"
              ? "Daily transactions this week"
              : period === "month"
              ? "Daily transactions this month"
              : "Monthly transactions this year"}
          </CardDescription>
        </div>
        <Select
          value={period}
          onValueChange={(value: TimeFrame) => setPeriod(value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              Loading...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <XAxis
                  dataKey="day"
                  tickFormatter={formatDay}
                  className="text-sm"
                />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="transactions"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary)/.2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
