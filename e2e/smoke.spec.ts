import { test, expect } from '@playwright/test';

test('home page loads pokemon list', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Pokémon' })).toBeVisible();
});

test('compare page loads empty state', async ({ page }) => {
  await page.goto('/compare');
  await expect(page.getByRole('heading', { name: 'Compare' })).toBeVisible();
  await expect(
    page.getByText('Add Pokémon from the list to compare up to 3.')
  ).toBeVisible();
});

test('compare page loads team from shared url', async ({ page }) => {
  await page.goto('/compare?pokemons=pikachu,charizard');
  await expect(page.getByRole('heading', { name: 'Compare' })).toBeVisible();
  await expect(page.getByText('pikachu', { exact: true })).toBeVisible();
  await expect(page.getByText('charizard', { exact: true })).toBeVisible();
});

test('compare page sanitizes malformed url segments', async ({ page }) => {
  await page.goto('/compare?pokemons=pikachu,!!!,charizard');
  await expect(page.getByText('pikachu', { exact: true })).toBeVisible();
  await expect(page.getByText('charizard', { exact: true })).toBeVisible();
  await expect(page).toHaveURL('/compare?pokemons=pikachu,charizard');
});

test('list card shows compare hint and go-to link', async ({ page }) => {
  await page.goto('/');

  const compareButtons = page.getByRole('button', { name: 'Compare' });
  await compareButtons.first().click();
  await expect(
    page.getByText('Choose one more to compare.').first()
  ).toBeVisible();

  await compareButtons.nth(1).click();
  const goToCompare = page.getByRole('link', { name: 'Go to compare' }).first();
  await expect(goToCompare).toBeVisible();
  await goToCompare.click();

  await expect(page).toHaveURL(/\/compare\?pokemons=/);
  await expect(page.getByRole('heading', { name: 'Compare' })).toBeVisible();
});
