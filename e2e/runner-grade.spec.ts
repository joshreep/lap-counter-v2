import { test, expect } from '@playwright/test'
import { clearFirestoreData } from './helpers/firebase-emulator'

const GRADE_OPTIONS = ['Pre-K', 'K', '1', '2', '3', '4', '5', '6', '7', '8', 'N/A']

test.beforeEach(async () => {
  await clearFirestoreData()
})

test('add runner with grade', async ({ page }) => {
  await page.goto('/add')
  await page.getByLabel('Runner Number').fill('10')
  await page.getByLabel('Name').fill('Abraham Lincoln')
  await page.getByLabel('Grade').selectOption('Pre-K')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByLabel('Runner Number')).toHaveValue('', { timeout: 10000 })

  await page.goto('/list')
  await expect(page.getByText('Abraham Lincoln')).toBeVisible()
})

test('grade select has all expected options', async ({ page }) => {
  await page.goto('/add')

  const gradeSelect = page.getByLabel('Grade')
  const options = gradeSelect.locator('option:not([disabled])')

  await expect(options).toHaveCount(GRADE_OPTIONS.length)
  for (const grade of GRADE_OPTIONS) {
    await expect(gradeSelect.locator(`option[value="${grade}"]`)).toBeAttached()
  }
})

test('grade is required for submission', async ({ page }) => {
  await page.goto('/add')
  await page.getByLabel('Runner Number').fill('20')
  await page.getByLabel('Name').fill('Test Runner')
  // Do NOT select a grade
  await page.getByRole('button', { name: 'Submit' }).click()

  // Form should still be on the add page
  await expect(page).toHaveURL(/.*add/)
  await expect(page.getByLabel('Grade')).toHaveValue('')
})

test('edit runner preserves grade', async ({ page }) => {
  await page.goto('/add')
  await page.getByLabel('Runner Number').fill('15')
  await page.getByLabel('Name').fill('James Madison')
  await page.getByLabel('Grade').selectOption('7')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByLabel('Runner Number')).toHaveValue('', { timeout: 10000 })

  await page.goto('/list')
  await expect(page.getByText('James Madison')).toBeVisible()

  await page.getByText('James Madison').click()
  await expect(page).toHaveURL(/.*edit/)

  await expect(page.getByLabel('Grade')).toHaveValue('7')
})
