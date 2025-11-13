import { execSync } from 'child_process'
import path from 'path'
import { DocumentSource, TagInfo } from './md-parser'

/**
 * grep을 사용하여 MD 파일에서 검색합니다
 * @param query 검색어
 * @param directoryPath 검색할 디렉토리
 * @param sourceFilter 소스 필터 (all, logic, pid, manual)
 * @returns TagInfo 배열
 */
export async function grepSearch(
  query: string,
  directoryPath: string,
  sourceFilter: 'all' | 'logic' | 'pid' | 'manual' = 'all'
): Promise<TagInfo[]> {
  if (!query.trim()) return []

  try {
    // 파일 패턴 결정
    let filePattern = '*.md'
    if (sourceFilter === 'logic') {
      filePattern = '1_control_logic*.md'
    } else if (sourceFilter === 'pid') {
      filePattern = '2_pid*.md'
    } else if (sourceFilter === 'manual') {
      filePattern = '3_manual*.md'
    }

    // grep 명령어 실행 (대소문자 구분 없음, 컨텍스트 포함)
    // -i: 대소문자 구분 없음
    // -n: 라인 번호 포함
    // -H: 파일명 포함
    // -C 2: 전후 2줄 컨텍스트
    // -P: Perl 정규식 사용 (줄바꿈 매칭을 위해)
    // -z: 줄바꿈을 null 문자로 처리 (여러 줄 매칭)

    // Windows 경로를 Unix 스타일로 변환
    const searchPath = path.join(directoryPath, filePattern).replace(/\\/g, '/')
    const escapedQuery = query.replace(/"/g, '\\"').replace(/\$/g, '\\$')

    // P&ID의 경우, 태그가 줄바꿈으로 분리될 수 있으므로 (예: HV\n5211)
    // 검색어를 분석하여 문자 부분과 숫자 부분으로 분리
    let alternativeQuery: string | null = null
    const tagMatch = query.match(/^([A-Z]+)(\d+)$/i)
    if (tagMatch) {
      // 예: "HV5211" -> "HV" (숫자 부분은 인접 줄 조합 로직에서 처리)
      alternativeQuery = tagMatch[1]
      console.log(`[grep-search] Detected tag pattern: ${query} -> prefix: ${alternativeQuery}, number: ${tagMatch[2]}`)
    }

    const grepCommand = `grep -i -n -H -C 5 "${escapedQuery}" ${searchPath}`
    const alternativeGrepCommand = alternativeQuery
      ? `grep -i -n -H -C 5 "${alternativeQuery}" ${searchPath}`
      : null

    // 1. 기본 검색 실행
    let output: string = ''
    try {
      output = execSync(grepCommand, {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024, // 10MB
        cwd: directoryPath,
        shell: process.platform === 'win32' ? 'bash.exe' : '/bin/bash'
      })
    } catch (error: any) {
      // grep이 결과를 찾지 못하면 exit code 1을 반환
      if (error.status !== 1 && error.code !== 1) {
        // bash를 찾을 수 없는 경우
        if (error.code === 'ENOENT') {
          console.warn('bash not found, grep search unavailable')
          return []
        }
        console.error('Grep command error:', error.message)
      }
      // exit code 1은 결과 없음을 의미하므로 계속 진행
    }

    // 2. 유연한 검색 실행 (줄바꿈 허용) - P&ID의 경우에만
    let flexibleOutput: string = ''
    if ((sourceFilter === 'pid' || sourceFilter === 'all') && alternativeGrepCommand) {
      console.log(`[grep-search] Running alternative search for prefix: "${alternativeQuery}"`)
      try {
        flexibleOutput = execSync(alternativeGrepCommand, {
          encoding: 'utf-8',
          maxBuffer: 10 * 1024 * 1024,
          cwd: directoryPath,
          shell: process.platform === 'win32' ? 'bash.exe' : '/bin/bash'
        })
        console.log(`[grep-search] Alternative search output length: ${flexibleOutput.length}`)
      } catch (error: any) {
        // 에러 무시 (결과 없을 수 있음)
        console.log(`[grep-search] Alternative search returned no results`)
      }
    }

    // 두 검색 결과 합치기
    const combinedOutput = output + '\n' + flexibleOutput
    if (!combinedOutput.trim()) {
      return []
    }

    // grep 결과 파싱
    const results: TagInfo[] = []
    const lines = combinedOutput.split('\n')
    const seenTags = new Set<string>()

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line || line.startsWith('--')) continue

      // 파일명:라인번호:내용 형식
      // Windows 경로는 C:/... 형태이므로 : 가 여러 개 있을 수 있음
      // 형식: 경로:라인번호:내용 또는 경로-라인번호-내용 (context lines)
      const match = line.match(/^(.+?)[:\-](\d+)[:\-](.+)$/)
      if (!match) continue

      // - 로 구분된 라인은 context line이므로 스킵 (실제 매칭 라인만 처리)
      if (line.includes(`-${match[2]}-`)) {
        continue
      }

      const [, filePath, lineNumber, content] = match
      const fileName = path.basename(filePath)

      // 4_examples 제외
      if (fileName.startsWith('4_examples')) continue

      // 문서 소스 결정
      let documentSource: DocumentSource | undefined
      if (fileName.startsWith('1_control_logic')) documentSource = 'logic'
      else if (fileName.startsWith('2_pid')) documentSource = 'pid'
      else if (fileName.startsWith('3_manual')) documentSource = 'manual'

      // 태그명 추출 시도
      let tagName = content.trim()

      // Project Title 라인에서 태그명 추출 (예: "LNG HDR SOV(HV5301, HV5311) 074")
      const titleMatch = content.match(/\s+([A-Z][A-Z0-9\s\(\),\-\.\/]+)\s+(\d{3})\s/)
      if (titleMatch) {
        tagName = titleMatch[1].trim()
      }

      // ### 또는 ## 헤더에서 태그명 추출
      const headerMatch = content.match(/^##?\s+(.+)$/)
      if (headerMatch) {
        tagName = headerMatch[1].trim()
      }

      // **HV** 와 **5211** 같이 인접한 줄을 조합 시도 (P&ID용)
      // P&ID TEXT 패턴: **XYZ** (TEXT, layer: ...)
      const textMatch = content.match(/\*\*([A-Z0-9\-]+)\*\*\s+\(TEXT/)
      if (textMatch && documentSource === 'pid') {
        const firstPart = textMatch[1]
        // alternativeQuery와 매칭되는 경우에만 조합 시도 (HV5211 검색 시 HV만 체크)
        if (alternativeQuery && firstPart.toLowerCase() === alternativeQuery.toLowerCase()) {
          let foundAny = false
          // 다음 최대 10줄 체크 (P&ID에서 TEXT 항목들이 떨어져 있을 수 있음)
          for (let j = 1; j <= 10 && i + j < lines.length; j++) {
            const nextLine = lines[i + j].trim()
            if (!nextLine || nextLine.endsWith('--')) continue // 빈 줄이나 구분자 스킵

            // Context lines (with -) and match lines (with :) 둘 다 처리
            const nextMatch = nextLine.match(/^[^:\-]+[:\-]\d+[:\-]\s*\*\*([A-Z0-9\-]+)\*\*\s+\(TEXT/)
            if (nextMatch) {
              foundAny = true
              // 두 개를 조합
              const combinedTag = firstPart + nextMatch[1]
              console.log(`[grep-search] Found TEXT entries ${j} lines apart: "${firstPart}" + "${nextMatch[1]}" = "${combinedTag}"`)
              // 검색어와 유사하면 조합된 태그 사용
              if (normalizeForComparison(combinedTag).includes(normalizeForComparison(query))) {
                console.log(`[grep-search] ✓ Combined tag "${combinedTag}" matches query "${query}"`)
                tagName = combinedTag
                break
              }
            }
          }
          if (!foundAny) {
            // 샘플 nextLine 출력 (디버깅용)
            if (i + 1 < lines.length) {
              console.log(`[grep-search] No TEXT found after "${firstPart}". Next line sample: ${lines[i + 1].trim().substring(0, 80)}`)
            }
          }
        }
      }

      // 중복 제거를 위한 키
      const key = `${fileName}:${tagName}`
      if (seenTags.has(key)) continue
      seenTags.add(key)

      // 컨텍스트에서 설명 추출 (다음 몇 줄을 설명으로 사용)
      const contextLines: string[] = []
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const contextLine = lines[j].trim()
        if (!contextLine || contextLine.startsWith('--')) break

        const contextMatch = contextLine.match(/^[^:]+:\d+:(.+)$/)
        if (contextMatch) {
          const contextContent = contextMatch[1].trim()
          if (contextContent && !contextContent.startsWith('Project Title') && !contextContent.startsWith('---')) {
            contextLines.push(contextContent)
          }
        }
      }

      const description = contextLines.join(' ').substring(0, 200)

      results.push({
        tagName,
        description: description || `검색어 "${query}"가 포함된 항목`,
        sourceDocument: fileName,
        documentSource,
        pages: undefined // grep에서는 페이지 정보를 추출하기 어려움
      })
    }

    return results
  } catch (error) {
    console.error('Grep search error:', error)
    return []
  }
}

/**
 * 정규화된 문자열 비교를 위한 함수
 */
export function normalizeForComparison(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\s\.\-_\n\r]/g, '')
    .trim()
}
