"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Check } from "lucide-react"

export type DocumentSource = 'logic' | 'pid' | 'manual'

export interface Signal {
  id: string
  tagName: string
  description: string
  sources: DocumentSource[] // 여러 문서에서 나올 수 있음
  category?: string
  unit?: string
  range?: string
  location?: string
  pages?: string
  isManualOnly?: boolean
  sectionNumber?: string
  sectionTitle?: string
}

interface SignalSearchResultsProps {
  query: string
  results: Signal[]
  sourceFilter: "all" | "logic" | "pid" | "manual"
  onSourceFilterChange: (filter: "all" | "logic" | "pid" | "manual") => void
  onAddSignal: (signal: Signal) => void
  selectedSignalIds: string[]
  isLoading?: boolean
  error?: string | null
}

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

export function SignalSearchResults({
  query,
  results,
  sourceFilter,
  onSourceFilterChange,
  onAddSignal,
  selectedSignalIds,
  isLoading = false,
  error = null
}: SignalSearchResultsProps) {
  // API로부터 받은 결과를 사용
  const filteredSignals = results

  const isSelected = (signalId: string) => selectedSignalIds.includes(signalId)

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 pt-3 flex-none border-b">
        <div className="flex items-center justify-between gap-4 h-9">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg leading-none">검색 결과</CardTitle>
            <CardDescription className="text-sm leading-none">{filteredSignals.length}개</CardDescription>
          </div>
          <Tabs value={sourceFilter} onValueChange={(v) => onSourceFilterChange(v as any)}>
            <TabsList className="h-9">
              <TabsTrigger value="all" className="text-xs px-3">전체</TabsTrigger>
              <TabsTrigger value="logic" className="text-xs px-3">로직</TabsTrigger>
              <TabsTrigger value="pid" className="text-xs px-3">P&ID</TabsTrigger>
              <TabsTrigger value="manual" className="text-xs px-3">매뉴얼</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4 pt-3">
        <div className="h-full overflow-y-auto pr-2">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>검색 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>오류: {error}</p>
              <p className="text-sm mt-2">다시 시도해주세요</p>
            </div>
          ) : filteredSignals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {!query.trim() ? (
                <>
                  <p>검색어를 입력하세요</p>
                  <p className="text-sm mt-2">신호 태그명 또는 설명으로 검색할 수 있습니다</p>
                </>
              ) : (
                <>
                  <p>검색 결과가 없습니다</p>
                  <p className="text-sm mt-2">다른 검색어를 입력해보세요</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSignals.map((signal) => {
                const selected = isSelected(signal.id)
                return (
                  <Card key={signal.id} className={`hover:border-primary transition-colors ${selected ? 'border-primary bg-primary/5' : ''}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {/* 매뉴얼 전용 결과는 검색어를 제목으로 사용 */}
                            {signal.isManualOnly && query ? (
                              <h4 className="font-semibold text-sm">{query}</h4>
                            ) : (
                              <h4 className="font-mono font-semibold text-sm">{signal.tagName}</h4>
                            )}
                            {signal.sources.map((source) => (
                              <Badge
                                key={source}
                                variant="outline"
                                className={`text-xs h-5 ${getSourceColor(source)}`}
                              >
                                {getSourceLabel(source)}
                              </Badge>
                            ))}
                            {signal.pages && (
                              <span className="text-xs text-muted-foreground">
                                Page {signal.pages}
                              </span>
                            )}
                          </div>
                          {/* 매뉴얼 전용 결과는 출처를 굵게 표시 */}
                          {signal.isManualOnly && signal.sectionTitle && (
                            <p className="text-sm font-bold text-foreground mb-1">
                              출처: [{signal.sectionNumber}] {signal.sectionTitle}
                            </p>
                          )}
                          {signal.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{signal.description}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant={selected ? "secondary" : "default"}
                          onClick={() => !selected && onAddSignal(signal)}
                          disabled={selected}
                          className="shrink-0 h-8 text-xs shadow-md hover:shadow-lg active:shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                          {selected ? (
                            <>
                              <Check className="mr-1 h-3 w-3" />
                              추가됨
                            </>
                          ) : (
                            <>
                              <Plus className="mr-1 h-3 w-3" />
                              추가
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
