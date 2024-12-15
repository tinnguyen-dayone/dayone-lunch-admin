"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeFrame, fetchPriceAnalytics } from "@/lib/data";
import { useEffect, useState } from "react";
import { Pie, PieChart } from "recharts";

const chartConfig = {
  orders: {
    label: "Orders",
  },
  lower: {
    label: "< 15k",
    color: "hsl(var(--chart-1))",
  },
  low_mid: {
    label: "15k-20k",
    color: "hsl(var(--chart-2))",
  },
  mid: {
    label: "20k-25k",
    color: "hsl(var(--chart-3))",
  },
  high_mid: {
    label: "25k-30k",
    color: "hsl(var(--chart-4))",
  },
  high: {
    label: "30k+",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function PriceAnalysisChart() {
  const [period, setPeriod] = useState<TimeFrame>("week");
  const [data, setData] = useState<
    { range: string; orders: number; percentage: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const analytics = await fetchPriceAnalytics(period);
        const transformedData = analytics.map(
          (item: { range: string; orders: string; percentage: string }) => ({
            ...item,
            orders: parseInt(item.orders),
            percentage: parseFloat(item.percentage),
            fill: getFillColor(item.range),
          })
        );
        setData(transformedData);
      } catch (error) {
        console.error("Failed to fetch price analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const getFillColor = (range: string) => {
    const colors = {
      "< 15k": "hsl(var(--chart-1))",
      "15k-20k": "hsl(var(--chart-2))",
      "20k-25k": "hsl(var(--chart-3))",
      "25k-30k": "hsl(var(--chart-4))",
      "30k+": "hsl(var(--chart-5))",
    };
    return colors[range as keyof typeof colors] || "hsl(var(--chart-1))";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Price Analysis</CardTitle>
          <CardDescription>
            Distribution of orders by price range
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
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
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
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => `${label}`}
                      formatter={(value, name) => [
                        `${value} (${
                          data.find((d) => d.range === name)?.percentage
                        }%)`,
                        name,
                      ]}
                    />
                  }
                />
                <Pie
                  data={data}
                  dataKey="orders"
                  nameKey="range"
                  outerRadius={100}
                  label={(entry) => `${entry.range} (${entry.percentage}%)`}
                  labelLine={true}
                />
              </PieChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
