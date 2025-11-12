"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TrendChartProps {
  signalId: string
  title?: string
}

// 모크 데이터 생성 함수
function generateMockData(signalId: string) {
  const now = new Date()
  const data = []

  // 신호 타입에 따라 다른 패턴의 데이터 생성
  const baseValue = signalId.startsWith("T") ? 350 : signalId.startsWith("P") ? 15 : 50
  const variance = signalId.startsWith("T") ? 20 : signalId.startsWith("P") ? 3 : 10

  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hours = time.getHours()
    const minutes = time.getMinutes()

    // 시간대별 트렌드 추가
    let trend = 0
    if (hours >= 6 && hours <= 18) {
      trend = Math.sin((hours - 6) / 12 * Math.PI) * variance * 0.5
    }

    data.push({
      time: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
      value: baseValue + Math.random() * variance - variance / 2 + trend,
      setpoint: baseValue,
    })
  }

  return data
}

export function TrendChart({ signalId, title = "24시간 트렌드" }: TrendChartProps) {
  const data = generateMockData(signalId)

  // 신호 타입에 따라 단위 결정
  const unit = signalId.startsWith("T") ? "°C" : signalId.startsWith("P") ? "bar" : "%"

  return (
    <Card className="p-6 border-border/50 bg-gradient-to-br from-card to-card/50 shadow-sm">
      <div className="mb-4 pb-4 border-b border-border/50">
        <h3 className="font-semibold text-base mb-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-chart-1 animate-pulse shadow-lg shadow-chart-1/50" />
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">최근 24시간 데이터 ({unit})</p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            interval={4}
            stroke="hsl(var(--border))"
          />
          <YAxis
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            stroke="hsl(var(--border))"
            label={{ value: unit, angle: -90, position: 'insideLeft', fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={(value: number) => [`${value.toFixed(2)} ${unit}`, '']}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--chart-1))"
            name="실제값"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, fill: 'hsl(var(--chart-1))' }}
          />
          <Line
            type="monotone"
            dataKey="setpoint"
            stroke="hsl(var(--chart-2))"
            name="설정값"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <div className="text-center p-3 bg-gradient-to-br from-chart-1/10 to-chart-1/5 border border-chart-1/20 rounded-lg">
          <div className="text-muted-foreground mb-1 font-medium">현재값</div>
          <div className="font-bold text-base text-chart-1">{data[data.length - 1].value.toFixed(2)} {unit}</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20 rounded-lg">
          <div className="text-muted-foreground mb-1 font-medium">최대값</div>
          <div className="font-bold text-base text-destructive/90">{Math.max(...data.map(d => d.value)).toFixed(2)} {unit}</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-lg">
          <div className="text-muted-foreground mb-1 font-medium">최소값</div>
          <div className="font-bold text-base text-accent/90">{Math.min(...data.map(d => d.value)).toFixed(2)} {unit}</div>
        </div>
      </div>
    </Card>
  )
}
