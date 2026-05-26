import { test, expect } from '@playwright/test';

test('type filter updates url and list', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'bulbasaur' })).toBeVisible();

  await page.getByRole('combobox', { name: 'Filter by type' }).click();
  await page.getByRole('option', { name: 'fire' }).click();

  await expect(page).toHaveURL('/?type=fire');
  await expect(page.getByRole('link', { name: 'charmander' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'bulbasaur' })).not.toBeVisible();
});
