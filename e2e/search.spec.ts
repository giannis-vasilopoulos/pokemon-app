import { test, expect } from '@playwright/test';

test('live search filters visible pokemon by name', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'bulbasaur' })).toBeVisible();

  const search = page.getByRole('searchbox', {
    name: 'Search Pokémon by name',
  });
  await search.fill('char');

  await expect(page.getByRole('link', { name: 'charmander' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'bulbasaur' })).not.toBeVisible();

  await search.fill('');
  await expect(page.getByRole('link', { name: 'bulbasaur' })).toBeVisible();
});

test('search shows message when no pokemon match', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'bulbasaur' })).toBeVisible();

  await page
    .getByRole('searchbox', { name: 'Search Pokémon by name' })
    .fill('zzzznotfound');

  await expect(page.getByText('No Pokémon match your search.')).toBeVisible();
});
