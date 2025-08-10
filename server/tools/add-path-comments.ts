// server/tools/add-path-comments.ts
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '../../')
const EXTS = ['.ts', '.tsx']

function walk(baseDir: string, dir: string) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const full = path.join(dir, file)
    const stat = fs.statSync(full)

    if (stat.isDirectory()) {
      walk(baseDir, full)
    } else if (EXTS.includes(path.extname(full))) {
      const rel = path.relative(path.join(ROOT, baseDir), full).replace(/\\/g, '/')
      const commentPath = `${baseDir}/${rel}`
      const expectedComment = `// ${commentPath}`

      let content = fs.readFileSync(full, 'utf-8')

      const cleanedContent = content.replace(/^\/\/\s*(client|server)\/.*\n/, '')

      if (!cleanedContent.startsWith(expectedComment)) {
        const updated = `${expectedComment}\n${cleanedContent}`
        fs.writeFileSync(full, updated)
        console.log(`✔ Updated comment in ${commentPath}`)
      } else if (content !== cleanedContent) {
        fs.writeFileSync(full, cleanedContent)
        console.log(`✎ Removed old comment from ${commentPath}`)
      }
    }
  }
}

walk('client', path.join(ROOT, 'client/src'))
walk('server', path.join(ROOT, 'server/src'))
