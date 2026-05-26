import { test, expect } from '@playwright/test';

test('detail page shows stats and attributes for pikachu', async ({ page }) => {
  await page.goto('/pikachu');

  await expect(page.getByText('pikachu', { exact: true })).toBeVisible();
  await expect(page.getByText('electric', { exact: true })).toBeVisible();
  await expect(page.getByText('0.4 m')).toBeVisible();
  await expect(page.getByText('6.0 kg')).toBeVisible();
  await expect(page.getByText('Static')).toBeVisible();
  await expect(page.getByText('Lightning Rod')).toBeVisible();
  await expect(page.getByText('Hidden')).toBeVisible();
  await expect(page.getByText('35', { exact: true })).toBeVisible();
  await expect(page.getByText('90', { exact: true })).toBeVisible();
  await expect(page.getByRole('progressbar', { name: /HP 35/i })).toBeVisible();
  await expect(
    page.getByRole('progressbar', { name: /Speed 90/i })
  ).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveCount(6);
});

test('detail page navigates from list', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'pikachu' }).click();

  await expect(page).toHaveURL('/pikachu');
  await expect(page.getByText('pikachu', { exact: true })).toBeVisible();
});

test('detail page shows not found for unknown pokemon', async ({ page }) => {
  await page.goto('/missingno');

  await expect(
    page.getByRole('heading', { name: 'Pokémon not found' })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to list' })).toBeVisible();
});
