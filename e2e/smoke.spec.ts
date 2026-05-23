import { test, expect } from '@playwright/test';

test('home page loads pokemon list', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Pokémon' })).toBeVisible();
});

test('compare page loads', async ({ page }) => {
  await page.goto('/compare');
  await expect(page.getByRole('heading', { name: 'Compare' })).toBeVisible();
});
