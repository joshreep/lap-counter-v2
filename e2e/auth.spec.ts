import { test, expect } from '@playwright/test'
import { clearAuthUsers, createTestUser, TEST_USER } from './helpers/firebase-emulator'

test.use({ storageState: { cookies: [], origins: [] } })

test.beforeEach(async () => {
  await clearAuthUsers()
  await createTestUser()
})

test('successful sign in redirects to tracker', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill(TEST_USER.email)
  await page.getByLabel('Password').fill(TEST_USER.password)
  await page.getByRole('button', { name: 'Sign In' }).click()

  await expect(page).toHaveURL(/.*tracker/, { timeout: 10000 })
})

test('invalid credentials shows error message', async ({ page }) => {
  await page.goto('/login')
  await expect(page).toHaveURL(/.*login/, { timeout: 10000 })

  // Wait for the page to fully stabilize (dev server Fast Refresh)
  await page.waitForLoadState('networkidle')

  await page.getByLabel('Email').fill(TEST_USER.email)
  await page.getByLabel('Password').fill('wrongpassword')
  await page.getByRole('button', { name: 'Sign In' }).click()

  await expect(page.getByText('Incorrect username or password')).toBeVisible({ timeout: 10000 })
  await expect(page).toHaveURL(/.*login/)
})

test('sign out redirects to login', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill(TEST_USER.email)
  await page.getByLabel('Password').fill(TEST_USER.password)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page).toHaveURL(/.*tracker/, { timeout: 10000 })

  await page.getByRole('link', { name: 'Settings' }).click()
  await expect(page).toHaveURL(/.*settings/)
  await page.getByRole('button', { name: 'Sign Out' }).click()

  await expect(page).toHaveURL(/.*login/, { timeout: 10000 })
})
