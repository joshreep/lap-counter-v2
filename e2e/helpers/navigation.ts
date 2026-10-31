import { Page } from '@playwright/test'

/**
 * Navigate to a page by first loading the app (which redirects
 * authenticated users to /tracker due to the auth provider), then
 * using client-side link navigation to reach the target path.
 */
export async function navigateTo(page: Page, path: string) {
  // Full page load triggers auth provider mount -> redirect to /tracker
  await page.goto('/')
  await page.waitForURL(/.*tracker/, { timeout: 10000 })

  if (path === '/tracker') return

  if (path === '/list') {
    await page.getByRole('link', { name: 'Results' }).click()
    await page.waitForURL(/.*list/, { timeout: 10000 })
    return
  }

  if (path === '/add') {
    await page.getByLabel('Add a new participant').click()
    await page.waitForURL(/.*add/, { timeout: 10000 })
    return
  }

  if (path === '/settings') {
    await page.getByRole('link', { name: 'Settings' }).click()
    await page.waitForURL(/.*settings/, { timeout: 10000 })
    return
  }

  await page.goto(path)
}

/**
 * Navigate to a tab page. If the current page has tabs (tracker, list,
 * settings), uses client-side navigation. Otherwise, does a full page
 * load and waits for the auth redirect before navigating.
 */
export async function navigateToTab(page: Page, path: '/list' | '/tracker' | '/settings') {
  const tabNames: Record<string, string> = {
    '/list': 'Results',
    '/tracker': 'Tracker',
    '/settings': 'Settings',
  }

  const currentUrl = page.url()
  const isOnTabPage =
    currentUrl.includes('/tracker') ||
    currentUrl.includes('/list') ||
    currentUrl.includes('/settings')

  if (isOnTabPage) {
    await page.getByRole('link', { name: tabNames[path] }).click()
    await page.waitForURL(new RegExp(`.*${path.slice(1)}`), { timeout: 10000 })
  } else {
    // On a non-tab page (add/edit), do a full page load which will
    // redirect to /tracker, then navigate from there
    await page.goto('/')
    await page.waitForURL(/.*tracker/, { timeout: 10000 })
    if (path !== '/tracker') {
      await page.getByRole('link', { name: tabNames[path] }).click()
      await page.waitForURL(new RegExp(`.*${path.slice(1)}`), { timeout: 10000 })
    }
  }
}
