import { createHash } from 'node:crypto'
import { writeFileSync } from 'node:fs'

function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex')
}

function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

const appUsername = requireEnv('APP_USERNAME')
const appPassword = requireEnv('APP_PASSWORD')
const pinLat = requireEnv('PIN_LAT')
const pinLng = requireEnv('PIN_LNG')
const pinLabel = requireEnv('PIN_LABEL')

const envFile = [
  `VITE_APP_USERNAME_HASH=${sha256(appUsername)}`,
  `VITE_APP_PASSWORD_HASH=${sha256(appPassword)}`,
  `VITE_PIN_LAT=${pinLat}`,
  `VITE_PIN_LNG=${pinLng}`,
  `VITE_PIN_LABEL=${pinLabel}`,
  '',
].join('\n')

const outputPath = process.argv[2] || '.env.production'

writeFileSync(outputPath, envFile)
console.log(`Wrote ${outputPath} with hashed credentials and pin data.`)
