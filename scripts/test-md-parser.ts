import path from 'path'
import { parseAllMdFiles, searchTags, filterByType } from '../lib/md-parser'

async function main() {
  console.log('=== MD 파서 테스트 ===\n')

  const embeddingPath = path.join(process.cwd(), 'upload', 'embedding')
  console.log(`디렉토리: ${embeddingPath}\n`)

  try {
    // 1. 모든 MD 파일 파싱
    console.log('1. MD 파일 파싱 중...')
    const allTags = await parseAllMdFiles(embeddingPath)
    console.log(`✓ 총 ${allTags.length}개의 태그를 파싱했습니다.\n`)

    // 2. 몇 가지 샘플 태그 출력
    console.log('2. 샘플 태그 (처음 5개):')
    allTags.slice(0, 5).forEach((tag, index) => {
      console.log(`\n[${index + 1}] ${tag.tagName}`)
      console.log(`   - 타입: ${tag.type || 'N/A'}`)
      console.log(`   - 카테고리: ${tag.category || 'N/A'}`)
      console.log(`   - 페이지: ${tag.pages || 'N/A'}`)
      console.log(`   - 출처: ${tag.sourceDocument}`)
    })

    // 3. 검색 테스트
    console.log('\n\n3. 검색 테스트: "PP" 검색')
    const ppResults = searchTags(allTags, 'PP')
    console.log(`✓ ${ppResults.length}개의 결과를 찾았습니다.`)
    ppResults.slice(0, 3).forEach((tag, index) => {
      console.log(`   [${index + 1}] ${tag.tagName} - ${tag.description || 'N/A'}`)
    })

    // 4. 타입별 필터링 테스트
    console.log('\n\n4. 타입 필터: "제어 신호"')
    const controlSignals = filterByType(allTags, '제어')
    console.log(`✓ ${controlSignals.length}개의 제어 신호를 찾았습니다.`)

    console.log('\n\n5. 타입 필터: "AIT" (계측 신호)')
    const aitSignals = allTags.filter(tag => tag.tagName.startsWith('AIT'))
    console.log(`✓ ${aitSignals.length}개의 AIT 신호를 찾았습니다.`)
    aitSignals.slice(0, 3).forEach((tag, index) => {
      console.log(`   [${index + 1}] ${tag.tagName} - ${tag.type}`)
    })

    // 6. 유연한 검색 테스트
    console.log('\n\n6. 유연한 검색 테스트')

    console.log('\n[6-1] "FD FAN" 검색 (F.D FAN도 찾아야 함):')
    const fdResults = searchTags(allTags, 'FD FAN')
    console.log(`✓ ${fdResults.length}개의 결과`)
    fdResults.slice(0, 3).forEach((tag, index) => {
      console.log(`   [${index + 1}] ${tag.tagName} - ${tag.sourceDocument}`)
    })

    console.log('\n[6-2] "LCV2651" 검색 (LCV\\n2651도 찾아야 함):')
    const lcvResults = searchTags(allTags, 'LCV2651')
    console.log(`✓ ${lcvResults.length}개의 결과`)
    lcvResults.slice(0, 3).forEach((tag, index) => {
      console.log(`   [${index + 1}] ${tag.tagName} - ${tag.sourceDocument}`)
    })

    console.log('\n[6-3] "DH 순환" 검색:')
    const dhResults = searchTags(allTags, 'DH 순환')
    console.log(`✓ ${dhResults.length}개의 결과`)
    dhResults.forEach((tag, index) => {
      console.log(`\n   [${index + 1}] ${tag.tagName}`)
      console.log(`       출처: ${tag.sourceDocument} (${tag.documentSource})`)
      console.log(`       설명: ${tag.description?.substring(0, 80) || 'N/A'}`)
    })

    console.log('\n[6-4] "지역난방 순환" 검색:')
    const dhResults2 = searchTags(allTags, '지역난방 순환')
    console.log(`✓ ${dhResults2.length}개의 결과`)
    dhResults2.slice(0, 5).forEach((tag, index) => {
      console.log(`   [${index + 1}] ${tag.tagName} - ${tag.sourceDocument}`)
    })

    console.log('\n\n=== 테스트 완료 ===')
  } catch (error) {
    console.error('에러 발생:', error)
    process.exit(1)
  }
}

main()
