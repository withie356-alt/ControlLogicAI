"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ArrowRight, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Signal, DocumentSource } from "@/components/signal-search-results"

const getSourceLabel = (source: DocumentSource): string => {
  switch (source) {
    case 'logic': return '로직'
    case 'pid': return 'P&ID'
    case 'manual': return '매뉴얼'
  }
}

const getSourceColor = (source: DocumentSource): string => {
  switch (source) {
    case 'logic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'pid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'manual': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  }
}

interface SelectedSignalsListProps {
  selectedSignals: Signal[]
  onRemove: (signalId: string) => void
  onClearAll: () => void
}

export function SelectedSignalsList({ selectedSignals, onRemove, onClearAll }: SelectedSignalsListProps) {
  const router = useRouter()

  const handleAnalyze = () => {
    if (selectedSignals.length === 0) return

    // 단일 신호면 기존 분석 페이지로
    if (selectedSignals.length === 1) {
      router.push(`/analysis/${selectedSignals[0].id}`)
    } else {
      // 여러 신호면 조합 분석 페이지로 (나중에 구현)
      const signalIds = selectedSignals.map(s => s.id).join(',')
      router.push(`/analysis/multi?signals=${signalIds}`)
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 pt-3 flex-none border-b">
        <div className="flex items-center justify-between gap-4 h-9">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg leading-none">선택된 신호</CardTitle>
            <CardDescription className="text-sm leading-none">
              {selectedSignals.length}개 선택됨
            </CardDescription>
          </div>
          {selectedSignals.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-8 text-xs text-muted-foreground hover:text-destructive transition-all duration-200 active:scale-95 active:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              전체 삭제
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 pb-4 pt-3 flex flex-col">
        {selectedSignals.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
            <div>
              <p className="text-sm">선택된 신호가 없습니다</p>
              <p className="text-xs mt-2">왼쪽에서 신호를 선택해주세요</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto pr-2 space-y-1.5">
              {selectedSignals.map((signal, index) => (
                <Card key={signal.id} className="relative group hover:border-primary/50 transition-colors">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs h-5 shrink-0">
                        {index + 1}
                      </Badge>
                      <div className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-mono font-semibold text-xs">{signal.tagName}</h4>
                        {signal.sources.map((source) => (
                          <Badge
                            key={source}
                            variant="outline"
                            className={`text-[10px] h-4 px-1.5 ${getSourceColor(source)}`}
                          >
                            {getSourceLabel(source)}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(signal.id)}
                        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive active:scale-95 shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex-none pt-4 space-y-2 border-t mt-4">
              <Button
                onClick={handleAnalyze}
                className="w-full shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {selectedSignals.length === 1 ? (
                  <>
                    단일 신호 분석 시작
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    {selectedSignals.length}개 신호 조합 분석
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              {selectedSignals.length > 1 && (
                <p className="text-xs text-center text-muted-foreground">
                  여러 신호의 상관관계 및 로직 개선 방안을 분석합니다
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
