"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const revenueData = [
  { month: 0, revenue: 4000 },
  { month: 1, revenue: 3000 },
  { month: 2, revenue: 5000 },
  { month: 3, revenue: 4500 },
  { month: 4, revenue: 6000 },
  { month: 5, revenue: 5500 },
  { month: 6, revenue: 8000 },
  { month: 7, revenue: 7500 },
  { month: 8, revenue: 9000 },
  { month: 9, revenue: 8500 },
  { month: 10, revenue: 11000 },
  { month: 11, revenue: 12500 },
];

export function RevenueChart() {
  const locale = useLocale();
  const t = useTranslations("DashboardLegacy.revenueChart");
  const [chartReady, setChartReady] = useState(false);
  const data = useMemo(
    () =>
      revenueData.map((point) => ({
        name: new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(2026, point.month, 1)),
        revenue: point.revenue,
      })),
    [locale],
  );
  const currencyPrefix = locale === "zh-CN" ? "￥" : "$";

  useEffect(() => {
    setChartReady(true);
  }, []);

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div>
          <CardTitle className="text-lg font-semibold">{t("title")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-2 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">{t("currentPeriod")}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          {chartReady ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--ui-primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--ui-primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--ui-border))" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--ui-muted-foreground))', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--ui-muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value: number) => `${currencyPrefix}${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--ui-popover))',
                    border: '1px solid hsl(var(--ui-border))',
                    borderRadius: '12px',
                    color: 'hsl(var(--ui-popover-foreground))'
                  }}
                  itemStyle={{ color: 'hsl(var(--ui-primary))' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--ui-primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
