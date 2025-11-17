"use client"

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { format } from "date-fns"
import type { VitalRecord } from "@/lib/vitals"

interface VitalsChartProps {
  vitals: VitalRecord[]
}

export function VitalsChart({ vitals }: VitalsChartProps) {
  const weightData = vitals
    .filter((v) => v.type === "weight")
    .slice(0, 10)
    .reverse()
    .map((v) => ({
      date: format(new Date(v.date), "MMM dd"),
      weight: v.value,
      source: v.source,
      fullDate: v.date,
    }))

  const bpData = vitals
    .filter((v) => v.type === "blood_pressure")
    .slice(0, 10)
    .reverse()
    .map((v) => ({
      date: format(new Date(v.date), "MMM dd"),
      systolic: v.systolic,
      diastolic: v.diastolic,
      source: v.source,
      clinicName: v.clinicName,
      clinicVisitDate: v.clinicVisitDate,
      label: v.source === "clinic" ? `Clinic Visit - ${format(new Date(v.clinicVisitDate || v.date), "MMM dd")}` : "",
    }))

  const glucoseData = vitals
    .filter((v) => v.type === "glucose")
    .slice(0, 10)
    .reverse()
    .map((v) => ({
      date: format(new Date(v.date), "MMM dd"),
      glucose: v.value,
      source: v.source,
      clinicName: v.clinicName,
      clinicVisitDate: v.clinicVisitDate,
      label: v.source === "clinic" ? `Clinic Visit - ${format(new Date(v.clinicVisitDate || v.date), "MMM dd")}` : "",
    }))

  // Prepare mood data
  const moodData = vitals
    .filter((v) => v.type === "mood")
    .slice(0, 10)
    .reverse()
    .map((v) => ({
      date: format(new Date(v.date), "MMM dd"),
      mood: v.value,
    }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
          {data.source === "clinic" && data.clinicName && (
            <p className="text-xs text-purple-600 mt-1 font-medium">Clinic: {data.clinicName}</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {weightData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weight Trend</CardTitle>
            <CardDescription>Last 10 measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                weight: {
                  label: "Weight (lbs)",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--chart-1))"
                    fill="url(#colorWeight)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {bpData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Blood Pressure</CardTitle>
            <CardDescription>Last 10 measurements (clinic-reported)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                systolic: {
                  label: "Systolic",
                  color: "hsl(var(--chart-2))",
                },
                diastolic: {
                  label: "Diastolic",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bpData}>
                  <defs>
                    <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDiastolic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="systolic"
                    stroke="hsl(var(--chart-2))"
                    fill="url(#colorSystolic)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="diastolic"
                    stroke="hsl(var(--chart-3))"
                    fill="url(#colorDiastolic)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {glucoseData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Glucose Levels</CardTitle>
            <CardDescription>Last 10 measurements (mg/dL, clinic-reported)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                glucose: {
                  label: "Glucose",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={glucoseData}>
                  <defs>
                    <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="glucose"
                    stroke="hsl(var(--chart-4))"
                    fill="url(#colorGlucose)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Mood Chart */}
      {moodData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mood Tracking</CardTitle>
            <CardDescription>Last 10 entries (1-5 scale)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                mood: {
                  label: "Mood Score",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moodData}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis domain={[0, 5]} fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(var(--chart-5))"
                    fill="url(#colorMood)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {vitals.length === 0 && (
        <Card className="md:col-span-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No vitals recorded yet</p>
            <Button asChild>
              <a href="/patient/vitals/add">Add Your First Measurement</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
