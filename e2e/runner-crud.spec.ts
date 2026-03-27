import { test, expect } from '@playwright/test'
import { clearFirestoreData } from './helpers/firebase-emulator'

test.beforeEach(async () => {
  await clearFirestoreData()
})

test('add a runner', async ({ page }) => {
  await page.goto('/list')
  await page.getByLabel('Add a new participant').click()
  await expect(page).toHaveURL(/.*add/)

  await page.getByLabel('Runner Number').fill('42')
  await page.getByLabel('Name').fill('George Washington')
  await page.getByLabel('Grade').selectOption('5')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByLabel('Runner Number')).toHaveValue('', { timeout: 10000 })

  await page.goto('/list')
  await expect(page.getByText('George Washington')).toBeVisible()
  await expect(page.getByText('42')).toBeVisible()
})

test('edit a runner', async ({ page }) => {
  await page.goto('/add')
  await page.getByLabel('Runner Number').fill('7')
  await page.getByLabel('Name').fill('John Adams')
  await page.getByLabel('Grade').selectOption('3')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByLabel('Runner Number')).toHaveValue('', { timeout: 10000 })

  await page.goto('/list')
  await expect(page.getByText('John Adams')).toBeVisible()

  await page.getByText('John Adams').click()
  await expect(page).toHaveURL(/.*edit/)

  await page.getByLabel('Name').fill('John Quincy Adams')
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.waitForURL(/.*list/, { timeout: 10000 })

  await expect(page.getByText('John Quincy Adams')).toBeVisible()
})

test('delete a runner', async ({ page }) => {
  await page.goto('/add')
  await page.getByLabel('Runner Number').fill('99')
  await page.getByLabel('Name').fill('Thomas Jefferson')
  await page.getByLabel('Grade').selectOption('K')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByLabel('Runner Number')).toHaveValue('', { timeout: 10000 })

  await page.goto('/list')
  await expect(page.getByText('Thomas Jefferson')).toBeVisible()

  await page.getByText('Thomas Jefferson').click()
  await expect(page).toHaveURL(/.*edit/)

  page.on('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Delete' }).click()
  await page.waitForURL(/.*list/, { timeout: 10000 })

  await expect(page.getByText('Thomas Jefferson')).not.toBeVisible()
})
