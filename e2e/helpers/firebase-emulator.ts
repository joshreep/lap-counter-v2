const PROJECT_ID = 'demo-lap-counter'
const AUTH_EMULATOR_URL = 'http://127.0.0.1:9099'
const FIRESTORE_EMULATOR_URL = 'http://127.0.0.1:8080'

export const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123',
}

export async function createTestUser(email = TEST_USER.email, password = TEST_USER.password) {
  const response = await fetch(
    `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  )
  if (!response.ok) {
    throw new Error(`Failed to create test user: ${response.statusText}`)
  }
  return response.json()
}

export async function clearAuthUsers() {
  const response = await fetch(
    `${AUTH_EMULATOR_URL}/emulator/v1/projects/${PROJECT_ID}/accounts`,
    { method: 'DELETE' },
  )
  if (!response.ok) {
    throw new Error(`Failed to clear auth users: ${response.statusText}`)
  }
}

export async function clearFirestoreData() {
  const response = await fetch(
    `${FIRESTORE_EMULATOR_URL}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`,
    { method: 'DELETE' },
  )
  if (!response.ok) {
    throw new Error(`Failed to clear Firestore data: ${response.statusText}`)
  }
}
