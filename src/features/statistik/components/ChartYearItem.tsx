"use client";

import { trpc } from "@/utils/trpc";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  items: {
    label: "Barang Tercatat",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const renderValueLabel = (props: any) => {
  const { value, x, y, width } = props;
  if (!value) return null;
  return (
    <text
      x={x + width + 8}
      y={y}
      dy={14}
      fill="var(--foreground)"
      fontSize={12}
      textAnchor="start"
    >
      {value}
    </text>
  );
};

export default function ChartYearItem() {
  const { data: chartData = [], isLoading } =
    trpc.items.getMonthlyCounts.useQuery();

  return (
    <Card className="bg-secondary-background text-foreground">
      <CardHeader>
        <CardTitle className="text-2xl">Data Pencatatan Barang</CardTitle>
        <CardDescription className="text-base">
          Januari - Desember {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-lg">Mohon tunggu sebentar ya...</p>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ right: 16 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="month"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="items" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="items" fill="var(--color-items)" radius={4}>
                <LabelList
                  dataKey="month"
                  position="insideLeft"
                  offset={8}
                  className="fill-(--color-main-foreground)"
                  fontSize={12}
                />
                <LabelList
                  dataKey="items"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                  content={renderValueLabel}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Dihitung berdasarkan pencatatan dibuat
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Data statistik pencatatan barang untuk tahun{" "}
          {new Date().getFullYear()}
        </div>
      </CardFooter>
    </Card>
  );
}
