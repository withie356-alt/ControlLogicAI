"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { SignalSearchResults, Signal } from "@/components/signal-search-results"
import { SelectedSignalsList } from "@/components/selected-signals-list"

const STORAGE_KEY = "signal-search-history"
const MAX_HISTORY = 10

export function SignalSearchInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actualQuery, setActualQuery] = useState("") // 실제 검색된 쿼리
  const [sourceFilter, setSourceFilter] = useState<"all" | "logic" | "pid" | "manual">("all")
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedSignals, setSelectedSignals] = useState<Signal[]>([])
  const [searchResults, setSearchResults] = useState<Signal[]>([])
  const [searchError, setSearchError] = useState<string | null>(null)

  // Load search history from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to load search history", e)
        }
      }
    }
  }, [])

  // Save search history to localStorage
  const saveSearchHistory = (searches: string[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searches))
      setRecentSearches(searches)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchError(null)

    try {
      // API 호출
      const params = new URLSearchParams({
        q: searchQuery.trim(),
        source: sourceFilter,
        limit: '500',
      })

      const response = await fetch(`/api/tags/search?${params}`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.signals || [])
        setActualQuery(searchQuery.trim())

        // Add to search history (remove duplicates and add to front)
        const newHistory = [
          searchQuery.trim(),
          ...recentSearches.filter((term) => term !== searchQuery.trim()),
        ].slice(0, MAX_HISTORY)

        saveSearchHistory(newHistory)
      } else {
        setSearchError(data.error || '검색에 실패했습니다')
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchError('검색 중 오류가 발생했습니다')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // 검색 소스 필터 변경 시 자동으로 재검색
  useEffect(() => {
    if (actualQuery) {
      // 필터 변경 시 재검색
      const performSearch = async () => {
        setIsSearching(true)
        setSearchError(null)

        try {
          const params = new URLSearchParams({
            q: actualQuery,
            source: sourceFilter,
            limit: '500',
          })

          const response = await fetch(`/api/tags/search?${params}`)
          const data = await response.json()

          if (data.success) {
            setSearchResults(data.signals || [])
          } else {
            setSearchError(data.error || '검색에 실패했습니다')
            setSearchResults([])
          }
        } catch (error) {
          console.error('Search error:', error)
          setSearchError('검색 중 오류가 발생했습니다')
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      }

      performSearch()
    }
  }, [sourceFilter, actualQuery])

  const removeFromHistory = (term: string) => {
    const newHistory = recentSearches.filter((t) => t !== term)
    saveSearchHistory(newHistory)
  }

  const clearAllHistory = () => {
    saveSearchHistory([])
  }

  const handleAddSignal = (signal: Signal) => {
    if (!selectedSignals.find(s => s.id === signal.id)) {
      setSelectedSignals([...selectedSignals, signal])
    }
  }

  const handleRemoveSignal = (signalId: string) => {
    setSelectedSignals(selectedSignals.filter(s => s.id !== signalId))
  }

  const handleClearAllSignals = () => {
    setSelectedSignals([])
  }

  return (
    <div className="space-y-3 h-full flex flex-col">
      {/* Search Bar */}
      <div className="flex gap-2 items-center flex-none">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="신호 태그명 또는 설명으로 검색하세요 (예: FCZ5202A, DH 순환펌프, TRIP 조건)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-12 h-12 text-base"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          size="lg"
          className="px-8 h-12 shadow-md hover:shadow-lg active:shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSearching ? "검색 중..." : "검색"}
        </Button>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="flex items-center gap-4 py-2 px-4 rounded-lg border border-border/50 bg-muted/20 flex-none">
          <h3 className="text-sm font-semibold text-foreground whitespace-nowrap">최근 검색</h3>
          <div className="flex flex-wrap gap-2 flex-1">
            {recentSearches.map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery(term)}
                className="hover:bg-chart-3/30 hover:text-chart-3 hover:border-chart-3 h-7 text-xs bg-background transition-all duration-200 active:scale-95 active:bg-chart-3/40"
              >
                {term}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllHistory}
            className="h-7 text-xs text-muted-foreground hover:text-destructive whitespace-nowrap transition-all duration-200 active:scale-95 active:bg-destructive/10"
          >
            전체 삭제
          </Button>
        </div>
      )}

      {/* Two Column Layout: Search Results (Left) and Selected Signals (Right) */}
      <div className="flex-1 min-h-0 grid grid-cols-5 gap-4">
        {/* Left: Search Results (3/5 width) */}
        <div className="col-span-3 min-h-0">
          <SignalSearchResults
            query={actualQuery}
            results={searchResults}
            sourceFilter={sourceFilter}
            onSourceFilterChange={setSourceFilter}
            onAddSignal={handleAddSignal}
            selectedSignalIds={selectedSignals.map(s => s.id)}
            isLoading={isSearching}
            error={searchError}
          />
        </div>

        {/* Right: Selected Signals (2/5 width) */}
        <div className="col-span-2 min-h-0">
          <SelectedSignalsList
            selectedSignals={selectedSignals}
            onRemove={handleRemoveSignal}
            onClearAll={handleClearAllSignals}
          />
        </div>
      </div>
    </div>
  )
}
