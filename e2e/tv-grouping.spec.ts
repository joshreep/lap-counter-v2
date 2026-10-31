import { test, expect, Page } from '@playwright/test'
import { clearFirestoreData } from './helpers/firebase-emulator'
import { navigateTo, navigateToTab } from './helpers/navigation'

test.beforeEach(async () => {
  await clearFirestoreData()
})

async function addRunner(page: Page, runnerId: string, name: string, grade: string, gender: string) {
  await navigateTo(page, '/add')
  await page.getByLabel('Runner Number').fill(runnerId)
  await page.getByLabel('Name').fill(name)
  await page.getByLabel('Grade').selectOption(grade)
  await page.getByLabel('Gender').selectOption(gender)
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByLabel('Runner Number')).toHaveValue('', { timeout: 10000 })
}

test('TV view shows ungrouped results by default', async ({ page }) => {
  await addRunner(page, '101', 'Alice Smith', 'K', 'Girl')
  await addRunner(page, '102', 'Bob Jones', 'Pre-K', 'Boy')
  await addRunner(page, '103', 'Carol White', '1', 'Girl')

  await page.goto('/tv')

  await expect(page.getByText('Alice Smith').first()).toBeVisible({ timeout: 10000 })
  await expect(page.getByText('Bob Jones').first()).toBeVisible()
  await expect(page.getByText('Carol White').first()).toBeVisible()

  // Group headers should NOT be present when ungrouped
  await expect(page.getByText('K - Girl')).not.toBeVisible()
  await expect(page.getByText('Pre-K - Boy')).not.toBeVisible()
  await expect(page.getByText('1 - Girl')).not.toBeVisible()
})

test('toggle grouping in settings and verify TV view shows grouped results', async ({ page }) => {
  await addRunner(page, '201', 'Dan Brown', 'K', 'Boy')
  await addRunner(page, '202', 'Eve Green', 'K', 'Girl')
  await addRunner(page, '203', 'Frank Black', 'Pre-K', 'Boy')

  // Navigate to settings and enable grouping
  await navigateToTab(page, '/settings')
  const groupingCheckbox = page.getByRole('checkbox', { name: 'Group TV View by Grade & Gender' })
  await expect(groupingCheckbox).toBeVisible({ timeout: 10000 })
  await expect(groupingCheckbox).not.toBeChecked()
  await groupingCheckbox.check()
  await expect(groupingCheckbox).toBeChecked()

  // Wait for Firestore write to complete before navigating away
  await page.waitForTimeout(1000)

  // Navigate to TV view and verify grouped headers
  await page.goto('/tv')

  await expect(page.getByText('Dan Brown').first()).toBeVisible({ timeout: 10000 })
  await expect(page.getByText('Eve Green').first()).toBeVisible()
  await expect(page.getByText('Frank Black').first()).toBeVisible()

  // Group headers should be present
  await expect(page.getByText('Pre-K - Boy').first()).toBeVisible({ timeout: 10000 })
  await expect(page.getByText('K - Boy').first()).toBeVisible()
  await expect(page.getByText('K - Girl').first()).toBeVisible()
})

test('grouping setting persists after page reload', async ({ page }) => {
  await addRunner(page, '301', 'Grace Lee', '3', 'Girl')

  // Enable grouping via settings
  await navigateToTab(page, '/settings')
  const groupingCheckbox = page.getByRole('checkbox', { name: 'Group TV View by Grade & Gender' })
  await expect(groupingCheckbox).toBeVisible({ timeout: 10000 })
  await expect(groupingCheckbox).not.toBeChecked()
  await groupingCheckbox.click()
  await expect(groupingCheckbox).toBeChecked({ timeout: 10000 })

  // Wait for Firestore write to persist
  await page.waitForTimeout(2000)

  // Full page reload via navigating away and back to verify persistence
  await page.goto('/')
  await page.waitForURL(/.*tracker/, { timeout: 10000 })

  // Navigate to settings and verify the setting persisted across reload
  await navigateToTab(page, '/settings')
  await expect(
    page.getByRole('checkbox', { name: 'Group TV View by Grade & Gender' }),
  ).toBeChecked({ timeout: 15000 })

  // Navigate to TV view and confirm grouping is still active
  await page.goto('/tv')
  await expect(page.getByText('Grace Lee').first()).toBeVisible({ timeout: 15000 })
  await expect(page.getByText('3 - Girl').first()).toBeVisible()
})
