/**
 * Seeds the Firebase Auth emulator with a test user, then runs a given command.
 *
 * Usage: node scripts/seed-emulator.mjs <command>
 * Example: node scripts/seed-emulator.mjs 'next dev --turbopack'
 */

const AUTH_EMULATOR_URL = 'http://127.0.0.1:9099'
const TEST_USER = { email: 'test@example.com', password: 'testpassword123' }
const MAX_RETRIES = 30
const RETRY_DELAY_MS = 1000

async function waitForEmulator() {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const res = await fetch(`${AUTH_EMULATOR_URL}/`)
      if (res.ok) return
    } catch {
      // emulator not ready yet
    }
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
  }
  throw new Error(`Auth emulator not ready after ${MAX_RETRIES}s`)
}

async function createTestUser() {
  const res = await fetch(
    `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password,
        returnSecureToken: true,
      }),
    },
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Failed to create test user: ${res.status} ${body}`)
  }
}

async function main() {
  const command = process.argv.slice(2).join(' ')
  if (!command) {
    console.error('Usage: node scripts/seed-emulator.mjs <command>')
    process.exit(1)
  }

  console.log('Waiting for Auth emulator...')
  await waitForEmulator()

  console.log(`Creating test user: ${TEST_USER.email}`)
  await createTestUser()
  console.log('Test user created successfully.')

  const { execSync } = await import('child_process')
  execSync(command, { stdio: 'inherit', env: process.env })
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
