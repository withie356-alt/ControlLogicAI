import fs from 'fs'
import path from 'path'

export type DocumentSource = 'logic' | 'pid' | 'manual'

export interface TagInfo {
  tagName: string
  type?: string // 타입
  category?: string // 카테고리
  number?: string // 번호
  pages?: string // 페이지
  occurrenceCount?: string // 출현 횟수
  sourceFile?: string // 출처 파일
  layer?: string // 레이어
  description?: string // 설명
  sourceDocument?: string // 어떤 MD 파일에서 왔는지
  documentSource?: DocumentSource // 문서 분류
}

/**
 * 파일명으로부터 문서 분류를 판별합니다
 */
function getDocumentSource(filename: string): DocumentSource | undefined {
  if (filename.startsWith('1_control_logic')) return 'logic'
  if (filename.startsWith('2_pid')) return 'pid'
  if (filename.startsWith('3_manual')) return 'manual'
  return undefined
}

/**
 * MD 파일에서 태그 정보를 추출합니다
 * @param content MD 파일 내용
 * @param sourceDoc 출처 파일명
 * @returns TagInfo 배열
 */
function parseMarkdownContent(content: string, sourceDoc: string): TagInfo[] {
  const tags: TagInfo[] = []
  const documentSource = getDocumentSource(sourceDoc)

  // 매뉴얼 파일은 ## 레벨로 파싱 (다른 구조)
  if (documentSource === 'manual') {
    // ## [번호] 제목 형태로 섹션 나누기
    const sections = content.split(/\n## /).slice(1)

    for (const section of sections) {
      const lines = section.split('\n')
      const tagName = lines[0].trim()

      if (!tagName) continue

      // ### 내용 섹션 찾기
      const contentStartIndex = lines.findIndex(line => line.trim() === '### 내용')
      let description = ''

      if (contentStartIndex !== -1) {
        // ### 내용 이후의 텍스트를 설명으로 사용
        const contentLines = lines.slice(contentStartIndex + 1)
        description = contentLines
          .filter(line => {
            const trimmed = line.trim()
            // 빈 줄, ---, ### 등 제외
            return trimmed && !trimmed.startsWith('---') && !trimmed.startsWith('###') && !trimmed.startsWith('**페이지**')
          })
          .join(' ')
          .trim()
          .substring(0, 500) // 최대 500자
      }

      if (description) {
        tags.push({
          tagName,
          description,
          sourceDocument: sourceDoc,
          documentSource
        })
      }
    }

    return tags
  }

  // 일반 파일 (로직, P&ID): ### 로 섹션 나누기
  const sections = content.split(/\n### /).slice(1)

  for (const section of sections) {
    const lines = section.split('\n')
    const tagName = lines[0].trim()

    if (!tagName) continue

    const tagInfo: TagInfo = {
      tagName,
      sourceDocument: sourceDoc,
      documentSource
    }

    // 각 라인에서 정보 추출
    for (const line of lines) {
      const trimmedLine = line.trim()

      // - **키**: 값 형태의 정보 추출
      const match = trimmedLine.match(/^-\s+\*\*(.+?)\*\*:\s*(.+)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim()

        switch (key) {
          case '타입':
            tagInfo.type = value
            break
          case '카테고리':
            tagInfo.category = value
            break
          case '번호':
            tagInfo.number = value
            break
          case '페이지':
            tagInfo.pages = value
            break
          case '출현 횟수':
            tagInfo.occurrenceCount = value
            break
          case '출처 파일':
            tagInfo.sourceFile = value
            break
          case '레이어':
            tagInfo.layer = value
            break
        }
      }

      // **설명**: 로 시작하는 설명 추출
      if (trimmedLine.startsWith('**설명**:')) {
        tagInfo.description = trimmedLine.replace('**설명**:', '').trim()
      }
    }

    tags.push(tagInfo)
  }

  return tags
}

/**
 * 지정된 디렉토리의 모든 MD 파일을 파싱합니다
 * @param directoryPath MD 파일들이 있는 디렉토리 경로
 * @returns 모든 태그 정보 배열
 */
export async function parseAllMdFiles(directoryPath: string): Promise<TagInfo[]> {
  const allTags: TagInfo[] = []

  try {
    // 디렉토리 내 모든 .md 파일 찾기
    const files = fs.readdirSync(directoryPath)
    const mdFiles = files.filter(file =>
      file.endsWith('.md') &&
      !file.startsWith('4_examples') // 4_examples.md 제외
    )

    console.log(`Found ${mdFiles.length} MD files in ${directoryPath}`)

    for (const file of mdFiles) {
      const filePath = path.join(directoryPath, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      const tags = parseMarkdownContent(content, file)
      allTags.push(...tags)

      console.log(`Parsed ${tags.length} tags from ${file}`)
    }

    console.log(`Total tags parsed: ${allTags.length}`)

    return allTags
  } catch (error) {
    console.error('Error parsing MD files:', error)
    throw error
  }
}

/**
 * 문자열을 정규화합니다 (점, 공백, 줄바꿈, 하이픈 등 제거)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\s\.\-_\n\r]/g, '') // 공백, 점, 하이픈, 언더스코어, 줄바꿈 제거
    .trim()
}

/**
 * 태그명으로 검색합니다 (대소문자 구분 없음, 부분 일치, 유연한 매칭)
 * @param tags 태그 배열
 * @param query 검색어
 * @returns 검색 결과
 */
export function searchTags(tags: TagInfo[], query: string): TagInfo[] {
  const lowerQuery = query.toLowerCase().trim()
  const normalizedQuery = normalizeString(query)

  if (!lowerQuery) return []

  return tags.filter(tag => {
    const tagNameLower = tag.tagName.toLowerCase()
    const descriptionLower = tag.description?.toLowerCase() || ''
    const categoryLower = tag.category?.toLowerCase() || ''
    const typeLower = tag.type?.toLowerCase() || ''

    // 일반 검색 (기본)
    const basicMatch =
      tagNameLower.includes(lowerQuery) ||
      descriptionLower.includes(lowerQuery) ||
      categoryLower.includes(lowerQuery) ||
      typeLower.includes(lowerQuery)

    // 정규화된 검색 (특수문자 무시)
    const normalizedMatch =
      normalizeString(tag.tagName).includes(normalizedQuery) ||
      normalizeString(tag.description || '').includes(normalizedQuery) ||
      normalizeString(tag.category || '').includes(normalizedQuery) ||
      normalizeString(tag.type || '').includes(normalizedQuery)

    return basicMatch || normalizedMatch
  })
}

/**
 * 특정 타입의 태그만 필터링합니다
 * @param tags 태그 배열
 * @param type 타입 (예: "제어 신호", "AIT" 등)
 * @returns 필터링된 태그 배열
 */
export function filterByType(tags: TagInfo[], type: string): TagInfo[] {
  const lowerType = type.toLowerCase()
  return tags.filter(tag => tag.type?.toLowerCase().includes(lowerType))
}

/**
 * 특정 카테고리의 태그만 필터링합니다
 * @param tags 태그 배열
 * @param category 카테고리
 * @returns 필터링된 태그 배열
 */
export function filterByCategory(tags: TagInfo[], category: string): TagInfo[] {
  const lowerCategory = category.toLowerCase()
  return tags.filter(tag => tag.category?.toLowerCase().includes(lowerCategory))
}

/**
 * MD 파일에서 특정 태그의 상세 정보를 추출합니다 (주요 신호 섹션 포함)
 * @param directoryPath MD 파일 디렉토리
 * @param tagName 찾을 태그명
 * @returns 태그 상세 정보 (전체 섹션 텍스트 포함)
 */
export async function getTagDetailFromMd(directoryPath: string, tagName: string): Promise<string | null> {
  try {
    const files = fs.readdirSync(directoryPath)
    const mdFiles = files.filter(file => file.endsWith('.md'))

    for (const file of mdFiles) {
      const filePath = path.join(directoryPath, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      // 태그명이 포함된 섹션을 찾습니다
      const regex = new RegExp(`###?\\s+${tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?(?=\\n###|\\n##|$)`, 'gi')
      const matches = content.match(regex)

      if (matches && matches.length > 0) {
        return matches[0]
      }
    }

    return null
  } catch (error) {
    console.error('Error getting tag detail:', error)
    return null
  }
}

/**
 * 인덱스 파일에서 장비별 페이지 정보를 추출합니다
 * @param directoryPath MD 파일 디렉토리
 * @returns 장비명과 페이지 범위 맵
 */
export async function parseEquipmentIndex(directoryPath: string): Promise<Map<string, string>> {
  const equipmentMap = new Map<string, string>()

  try {
    const files = fs.readdirSync(directoryPath)
    const indexFiles = files.filter(file =>
      file.includes('index') || file.includes('catalog')
    )

    for (const file of indexFiles) {
      const filePath = path.join(directoryPath, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      // "페이지", "Page" 키워드와 함께 있는 라인 찾기
      const lines = content.split('\n')
      let currentEquipment = ''

      for (const line of lines) {
        // #### 또는 ### 헤더에서 장비명 추출
        const equipMatch = line.match(/^####?\s+(.+)/)
        if (equipMatch) {
          currentEquipment = equipMatch[1].trim()
        }

        // 페이지 범위 추출
        const pageMatch = line.match(/\*\*페이지.*?\*\*:\s*(.+)|Page\s+(\d+[-,\s\d]+)/i)
        if (pageMatch && currentEquipment) {
          const pageInfo = pageMatch[1] || pageMatch[2]
          equipmentMap.set(currentEquipment, pageInfo.trim())
        }
      }
    }

    return equipmentMap
  } catch (error) {
    console.error('Error parsing equipment index:', error)
    return equipmentMap
  }
}
