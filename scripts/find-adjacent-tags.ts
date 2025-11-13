import fs from 'fs'
import path from 'path'

const pidFile = path.join(process.cwd(), 'upload', 'embedding', '2_pid.md')
const content = fs.readFileSync(pidFile, 'utf-8')
const lines = content.split('\n')

console.log('Searching for HV followed by 5211...\n')

for (let i = 0; i < lines.length - 10; i++) {
  const line = lines[i]

  // Check if this line contains **HV** (TEXT
  if (line.includes('**HV**') && line.includes('(TEXT')) {
    // Check the next 10 lines for **5211**
    for (let j = 1; j <= 10; j++) {
      if (i + j < lines.length && lines[i + j].includes('**5211**') && lines[i + j].includes('(TEXT')) {
        console.log(`Found HV at line ${i + 1}, 5211 at line ${i + j + 1}`)
        console.log(`Lines ${i + 1} to ${i + j + 5}:`)
        for (let k = 0; k <= j + 4 && i + k < lines.length; k++) {
          console.log(`  ${i + k + 1}: ${lines[i + k]}`)
        }
        console.log('\n---\n')
        break
      }
    }
  }
}

console.log('Search complete.')
