import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'

const seedFile = path.join(process.cwd(), 'seed', 'production.ndjson')
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  process.env.SANITY_STUDIO_DATASET ??
  'production'

if (!existsSync(seedFile)) {
  console.error(`Seed file not found: ${seedFile}`)
  process.exit(1)
}

console.log(`Importing ${seedFile} → dataset "${dataset}" (replace mode)...`)

execSync(`pnpm sanity dataset import "${seedFile}" ${dataset} --replace`, {
  stdio: 'inherit',
  env: process.env,
})

console.log('Done. Visit http://localhost:3000 and http://localhost:3000/studio')
