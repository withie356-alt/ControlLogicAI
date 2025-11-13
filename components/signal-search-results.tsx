"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Activity, Thermometer, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface SignalSearchResultsProps {
  query: string
  type: "all" | "control" | "measurement"
  onTypeChange: (type: "all" | "control" | "measurement") => void
}

// Mock data for demonstration
const mockSignals = [
  {
    id: "FCZ5202A",
    tagName: "FCZ5202A",
    description: "RH A 2차 과열기 Spray 댐퍼",
    type: "control",
    category: "PID",
    unit: "%",
    range: "0-100",
    location: "RH A 2차 과열기",
  },
  {
    id: "TI5201A",
    tagName: "TI5201A",
    description: "RH A 2차 과열기 출구 온도",
    type: "measurement",
    category: "온도",
    unit: "°C",
    range: "0-600",
    location: "RH A 2차 과열기",
  },
  {
    id: "PT1234B",
    tagName: "PT1234B",
    description: "DH 순환펌프 흡입압력",
    type: "measurement",
    category: "압력",
    unit: "kPa",
    range: "0-1000",
    location: "DH 순환펌프",
  },
  {
    id: "TRIP_DH_P01",
    tagName: "TRIP_DH_P01",
    description: "DH 순환펌프 TRIP 조건",
    type: "control",
    category: "TRIP",
    unit: "BOOL",
    range: "0/1",
    location: "DH 순환펌프",
  },
]

export function SignalSearchResults({ query, type, onTypeChange }: SignalSearchResultsProps) {
  const filteredSignals = mockSignals.filter((signal) => {
    const matchesQuery =
      signal.tagName.toLowerCase().includes(query.toLowerCase()) ||
      signal.description.toLowerCase().includes(query.toLowerCase())
    const matchesType = type === "all" || signal.type === type
    return matchesQuery && matchesType
  })

  const getIcon = (category: string) => {
    switch (category) {
      case "PID":
        return <Activity className="h-5 w-5 text-primary" />
      case "온도":
        return <Thermometer className="h-5 w-5 text-accent" />
      case "TRIP":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 flex-none border-b">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">검색 결과</CardTitle>
            <CardDescription className="text-sm">{filteredSignals.length}개</CardDescription>
          </div>
          <Tabs value={type} onValueChange={(v) => onTypeChange(v as any)}>
            <TabsList className="h-9">
              <TabsTrigger value="all" className="text-xs px-3">전체</TabsTrigger>
              <TabsTrigger value="control" className="text-xs px-3">제어</TabsTrigger>
              <TabsTrigger value="measurement" className="text-xs px-3">계측</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4 pt-3">
        <div className="h-full overflow-y-auto pr-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {filteredSignals.map((signal) => (
              <Card key={signal.id} className="hover:border-primary transition-colors">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
                      {getIcon(signal.category)}
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <h4 className="font-mono font-semibold text-sm">{signal.tagName}</h4>
                      <Badge variant={signal.type === "control" ? "default" : "outline"} className="text-xs h-5">
                        {signal.type === "control" ? "제어" : "계측"}
                      </Badge>
                      <span className="text-sm text-muted-foreground truncate">{signal.description}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {signal.range}{signal.unit}
                      </span>
                    </div>
                    <Link href={`/analysis/${signal.id}`}>
                      <Button
                        size="sm"
                        className="shrink-0 h-8 text-xs shadow-md hover:shadow-lg active:shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        분석 시작
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSignals.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>검색 결과가 없습니다</p>
              <p className="text-sm mt-2">다른 검색어를 입력해보세요</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
