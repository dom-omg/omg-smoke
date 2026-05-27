import { test, expect } from '@playwright/test'

const PAGES = ['/']

test.describe('Smoke', () => {
  for (const path of PAGES) {
    test(`${path} — page charge`, async ({ page }) => {
      const jsErrors: string[] = []
      page.on('console', msg => {
        if (msg.type() === 'error') jsErrors.push(msg.text())
      })
      await page.goto(path)
      await expect(page.locator('body')).not.toContainText('Application error')
      await expect(page.locator('body')).not.toContainText('This page could not be found')
      const realErrors = jsErrors.filter(
        e => !e.includes('favicon') && !e.includes('404') && !e.includes('hot-update')
      )
      expect(realErrors, `Erreurs JS: ${realErrors.join(', ')}`).toHaveLength(0)
    })

    test(`${path} — tous les boutons sont interactifs`, async ({ page }) => {
      await page.goto(path)
      const buttons = page.locator('button:not([disabled])')
      const count = await buttons.count()
      for (let i = 0; i < count; i++) {
        const btn = buttons.nth(i)
        await expect(btn).toBeVisible()
        await expect(btn).toBeEnabled()
        const box = await btn.boundingBox()
        expect(box, `Bouton #${i} sans dimensions (z-index ou pointer-events?)`).not.toBeNull()
        expect(box!.width, `Bouton #${i} width=0`).toBeGreaterThan(0)
        expect(box!.height, `Bouton #${i} height=0`).toBeGreaterThan(0)
      }
    })

    test(`${path} — tous les inputs sont interactifs`, async ({ page }) => {
      await page.goto(path)
      const inputs = page.locator('input:not([disabled]):not([type="hidden"]), textarea:not([disabled])')
      const count = await inputs.count()
      for (let i = 0; i < count; i++) {
        await expect(inputs.nth(i)).toBeVisible()
        await expect(inputs.nth(i)).toBeEnabled()
      }
    })

    test(`${path} — liens internes valides`, async ({ page }) => {
      await page.goto(path)
      const links = page.locator('a[href^="/"]')
      const count = await links.count()
      for (let i = 0; i < Math.min(count, 20); i++) {
        const href = await links.nth(i).getAttribute('href')
        if (href && !href.includes('#')) {
          const resp = await page.request.get(href)
          expect(resp.status(), `Lien ${href} → ${resp.status()}`).not.toBe(404)
        }
      }
    })
  }
})
