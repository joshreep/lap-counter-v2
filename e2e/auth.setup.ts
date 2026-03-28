import { test as setup, expect } from '@playwright/test'
import { clearAuthUsers, createTestUser, TEST_USER } from './helpers/firebase-emulator'

const authFile = 'e2e/.auth/user.json'

setup('authenticate', async ({ page }) => {
  await clearAuthUsers()
  await createTestUser()

  await page.goto('/login')
  await page.getByLabel('Email').fill(TEST_USER.email)
  await page.getByLabel('Password').fill(TEST_USER.password)
  await page.getByRole('button', { name: 'Sign In' }).click()

  await expect(page).toHaveURL(/.*tracker/, { timeout: 10000 })

  await page.context().storageState({ path: authFile })
})
