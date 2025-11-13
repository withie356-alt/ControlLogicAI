"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { SignalSearchResults } from "@/components/signal-search-results"

const STORAGE_KEY = "signal-search-history"
const MAX_HISTORY = 10

export function SignalSearchInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"all" | "control" | "measurement">("all")
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

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

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Add to search history (remove duplicates and add to front)
    const newHistory = [
      searchQuery.trim(),
      ...recentSearches.filter((term) => term !== searchQuery.trim()),
    ].slice(0, MAX_HISTORY)

    saveSearchHistory(newHistory)

    // Simulate search
    setTimeout(() => setIsSearching(false), 1000)
  }

  const removeFromHistory = (term: string) => {
    const newHistory = recentSearches.filter((t) => t !== term)
    saveSearchHistory(newHistory)
  }

  const clearAllHistory = () => {
    saveSearchHistory([])
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

      {/* Search Results - Always visible */}
      <div className="flex-1 min-h-0">
        <SignalSearchResults
          query={searchQuery}
          type={searchType}
          onTypeChange={setSearchType}
        />
      </div>
    </div>
  )
}
