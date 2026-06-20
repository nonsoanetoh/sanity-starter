import { execSync } from 'node:child_process'
import { mkdirSync, existsSync } from 'node:fs'
import path from 'node:path'

const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  process.env.SANITY_STUDIO_DATASET ??
  'production'

const backupsDir = path.join(process.cwd(), 'backups')
if (!existsSync(backupsDir)) mkdirSync(backupsDir, { recursive: true })

const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const outfile = path.join(backupsDir, `${dataset}-${timestamp}.tar.gz`)

console.log(`Exporting dataset "${dataset}" → ${outfile}...`)

execSync(`pnpm sanity dataset export ${dataset} "${outfile}"`, {
  stdio: 'inherit',
  env: process.env,
})

console.log('Export complete.')
