import { test, expect } from '@playwright/test'
import { clearFirestoreData } from './helpers/firebase-emulator'
import { navigateTo, navigateToTab } from './helpers/navigation'

const GENDER_OPTIONS = ['Boy', 'Girl']

test.beforeEach(async () => {
  await clearFirestoreData()
})

test('add runner with gender', async ({ page }) => {
  await navigateTo(page, '/add')
  await page.getByLabel('Runner Number').fill('10')
  await page.getByLabel('Name').fill('Abraham Lincoln')
  await page.getByLabel('Grade').selectOption('Pre-K')
  await page.getByLabel('Gender').selectOption('Boy')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByLabel('Runner Number')).toHaveValue('', { timeout: 10000 })

  await navigateToTab(page, '/list')
  await expect(page.getByText('Abraham Lincoln')).toBeVisible()
})

test('gender select has all expected options', async ({ page }) => {
  await navigateTo(page, '/add')

  const genderSelect = page.getByLabel('Gender')
  const options = genderSelect.locator('option:not([disabled])')

  await expect(options).toHaveCount(GENDER_OPTIONS.length)
  for (const gender of GENDER_OPTIONS) {
    await expect(genderSelect.locator(`option[value="${gender}"]`)).toBeAttached()
  }
})

test('gender is required for submission', async ({ page }) => {
  await navigateTo(page, '/add')
  await page.getByLabel('Runner Number').fill('20')
  await page.getByLabel('Name').fill('Test Runner')
  await page.getByLabel('Grade').selectOption('K')
  // Do NOT select a gender
  await page.getByRole('button', { name: 'Submit' }).click()

  // Form should still be on the add page
  await expect(page).toHaveURL(/.*add/)
  await expect(page.getByLabel('Gender')).toHaveValue('')
})

test('edit runner preserves gender', async ({ page }) => {
  await navigateTo(page, '/add')
  await page.getByLabel('Runner Number').fill('15')
  await page.getByLabel('Name').fill('James Madison')
  await page.getByLabel('Grade').selectOption('7')
  await page.getByLabel('Gender').selectOption('Girl')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByLabel('Runner Number')).toHaveValue('', { timeout: 10000 })

  await navigateToTab(page, '/list')
  await expect(page.getByText('James Madison')).toBeVisible()

  await page.getByText('James Madison').click()
  await expect(page).toHaveURL(/.*edit/)

  await expect(page.getByLabel('Gender')).toHaveValue('Girl')
})
