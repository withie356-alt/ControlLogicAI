import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { parseAllMdFiles, searchTags, TagInfo, DocumentSource } from '@/lib/md-parser'
import { grepSearch, normalizeForComparison } from '@/lib/grep-search'

// 태그 캐시 (서버 재시작 시 초기화됨)
let tagCache: TagInfo[] | null = null
let lastCacheTime: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5분

/**
 * 태그 캐시를 가져오거나 새로 파싱합니다
 */
async function getTagCache(): Promise<TagInfo[]> {
  const now = Date.now()

  // 캐시가 있고 유효하면 반환
  if (tagCache && (now - lastCacheTime < CACHE_DURATION)) {
    return tagCache
  }

  // 캐시가 없거나 만료되었으면 다시 파싱
  const embeddingPath = path.join(process.cwd(), 'upload', 'embedding')
  tagCache = await parseAllMdFiles(embeddingPath)
  lastCacheTime = now

  return tagCache
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const sourceFilter = searchParams.get('source') || 'all' // all, logic, pid, manual
    const limit = parseInt(searchParams.get('limit') || '50')

    // TODO: LLM 기반 검색으로 전환 예정
    // 임시로 빈 배열 반환
    return NextResponse.json({
      success: true,
      count: 0,
      total: 0,
      signals: [],
      message: 'LLM 기반 검색으로 전환 예정입니다.'
    })

    // 태그 데이터 가져오기
    // const allTags = await getTagCache()

    // 검색 수행
    let results = query ? searchTags(allTags, query) : allTags

    // grep 검색으로 파싱되지 않은 결과도 포함 (쿼리가 있을 때만)
    if (query) {
      try {
        const embeddingPath = path.join(process.cwd(), 'upload', 'embedding')
        const grepResults = await grepSearch(query, embeddingPath, sourceFilter as any)

        // grep 결과 중 파싱된 결과에 없는 것만 추가
        const parsedTagNames = new Set(results.map(t => normalizeForComparison(t.tagName)))

        for (const grepTag of grepResults) {
          const normalizedGrepTag = normalizeForComparison(grepTag.tagName)
          if (!parsedTagNames.has(normalizedGrepTag)) {
            results.push(grepTag)
            parsedTagNames.add(normalizedGrepTag)
          }
        }

        console.log(`Search "${query}": ${results.length - grepResults.length} parsed + ${grepResults.length} grep results`)
      } catch (error) {
        console.error('Grep search failed:', error)
        // grep 실패해도 파싱된 결과는 반환
      }
    }

    // 소스 필터링
    if (sourceFilter !== 'all') {
      results = results.filter(tag => tag.documentSource === sourceFilter)
    }

    // 태그명으로 그룹화 (같은 태그가 여러 문서에서 나올 수 있음)
    const groupedTags = new Map<string, TagInfo[]>()
    for (const tag of results) {
      const existing = groupedTags.get(tag.tagName) || []
      existing.push(tag)
      groupedTags.set(tag.tagName, existing)
    }

    // Signal 인터페이스에 맞게 변환
    const signals = Array.from(groupedTags.entries()).map(([tagName, tags]) => {
      // 여러 문서에서 나온 태그들의 정보를 병합
      const sources = Array.from(new Set(
        tags.map(t => t.documentSource).filter((s): s is DocumentSource => s !== undefined)
      ))

      // 설명은 가장 긴 것 사용 (더 상세할 가능성)
      const description = tags
        .map(t => t.description)
        .filter(d => d && d !== '설명 없음' && d !== '이 신호는 제어 로직에서 사용되는 제어 신호입니다.')
        .sort((a, b) => (b?.length || 0) - (a?.length || 0))[0]

      // 우선순위 계산 (낮을수록 우선)
      let priority = 0

      // 1. 설명이 있으면 우선순위 높음
      if (description) {
        priority += 0
      } else {
        priority += 100
      }

      // 2. catalog/index 파일에서만 나온 태그는 우선순위 낮음
      const isCatalogOnly = tags.every(t =>
        t.sourceDocument?.includes('catalog') ||
        t.sourceDocument?.includes('index')
      )
      if (isCatalogOnly) {
        priority += 200
      }

      // 3. P&ID에서 나온 태그는 우선순위 높임
      if (sources.includes('pid')) {
        priority -= 10
      }

      // 4. 실제 로직 파일에서 나온 태그는 우선순위 높임
      if (tags.some(t => t.sourceDocument === '1_control_logic.md')) {
        priority -= 20
      }

      // 매뉴얼 전용 결과인지 확인
      const isManualOnly = sources.length === 1 && sources[0] === 'manual'

      // 매뉴얼 섹션 정보 추출 (태그명에서 [번호] 부분 추출)
      const sectionMatch = tagName.match(/^\[([^\]]+)\]\s*(.*)$/)
      const sectionNumber = sectionMatch?.[1]
      const sectionTitle = sectionMatch?.[2] || tagName

      return {
        id: tagName,
        tagName,
        description: description || undefined,
        sources,
        category: tags[0].category,
        pages: tags[0].pages,
        sourceFile: tags[0].sourceFile,
        priority, // 우선순위 추가
        isManualOnly,
        sectionNumber,
        sectionTitle,
      }
    })

    // 우선순위 기반 정렬 (priority 낮은 순 -> 태그명 순)
    signals.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority
      }
      return a.tagName.localeCompare(b.tagName)
    })

    // 매뉴얼 결과 중복 제거 (설명이 매우 유사한 경우)
    const deduplicatedSignals: typeof signals = []
    const manualDescriptions = new Set<string>()

    for (const signal of signals) {
      if (signal.isManualOnly && signal.description) {
        // 설명의 첫 100자를 정규화하여 비교
        const normalizedDesc = signal.description
          .substring(0, 100)
          .toLowerCase()
          .replace(/\s+/g, ' ')
          .trim()

        // 이미 매우 유사한 설명이 있으면 스킵
        if (manualDescriptions.has(normalizedDesc)) {
          continue
        }
        manualDescriptions.add(normalizedDesc)
      }
      deduplicatedSignals.push(signal)
    }

    // 결과 제한 (기본 100 -> 500으로 증가, 모든 결과 보여주기)
    const effectiveLimit = limit || 500
    const limitedSignals = deduplicatedSignals.slice(0, effectiveLimit)

    return NextResponse.json({
      success: true,
      count: limitedSignals.length,
      total: signals.length,
      signals: limitedSignals,
    })
  } catch (error) {
    console.error('Tag search error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search tags',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * 캐시를 강제로 새로고침합니다 (POST 요청)
 */
export async function POST() {
  try {
    tagCache = null
    lastCacheTime = 0

    const tags = await getTagCache()

    return NextResponse.json({
      success: true,
      message: 'Cache refreshed',
      count: tags.length,
    })
  } catch (error) {
    console.error('Cache refresh error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh cache',
      },
      { status: 500 }
    )
  }
}
