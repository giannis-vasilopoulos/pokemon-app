import { test, expect } from '@playwright/test';

test('home page loads pokemon list', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Pokémon' })).toBeVisible();
});

test('team page loads empty state', async ({ page }) => {
  await page.goto('/team');
  await expect(page.getByRole('heading', { name: 'Team' })).toBeVisible();
  await expect(
    page.getByText('Add Pokémon from the list to build your team (up to 3).')
  ).toBeVisible();
});

test('team page loads team from shared url', async ({ page }) => {
  await page.goto('/team?pokemons=pikachu,charizard');
  await expect(page.getByRole('heading', { name: 'Team' })).toBeVisible();
  await expect(
    page.getByRole('columnheader', { name: /pikachu/i })
  ).toBeVisible();
  await expect(
    page.getByRole('columnheader', { name: /charizard/i })
  ).toBeVisible();
});

test('team page sanitizes malformed url segments', async ({ page }) => {
  await page.goto('/team?pokemons=pikachu,!!!,charizard');
  await expect(
    page.getByRole('columnheader', { name: /pikachu/i })
  ).toBeVisible();
  await expect(
    page.getByRole('columnheader', { name: /charizard/i })
  ).toBeVisible();
  await expect(page).toHaveURL('/team?pokemons=pikachu,charizard');
});

test('list card add to team and navigate via tray', async ({ page }) => {
  await page.goto('/');

  const addButtons = page.getByRole('button', { name: /add .+ to team/i });
  await expect(addButtons.first()).toBeVisible();
  await addButtons.first().click();
  await expect(page.getByText('Team (1/3):')).toBeVisible();

  await addButtons.nth(1).click();
  await expect(page.getByText('Team (2/3):')).toBeVisible();

  const viewTeam = page.getByRole('link', { name: 'View team →' });
  await expect(viewTeam).toBeVisible();
  await viewTeam.click();

  await expect(page).toHaveURL(/\/team\?pokemons=/);
  await expect(page.getByRole('heading', { name: 'Team' })).toBeVisible();
});
