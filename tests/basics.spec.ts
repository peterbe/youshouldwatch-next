import { test, expect } from "@playwright/test";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test("home page", async ({ page }) => {
  await page.goto(BASE_URL + "/");
  await expect(page).toHaveTitle(/You Should Watch/);
});

test("go to add page", async ({ page }) => {
  await page.goto(BASE_URL + "/");
  await page.getByTestId("nav-add").click();
  await expect(page).toHaveURL(/add/);
});

test("search and share", async ({ page }) => {
  await page.goto(BASE_URL + "/add");
  const input = page.getByTestId("add-search");
  await input.fill("departed");
  await input.press("Enter");
  await expect(page).toHaveURL(/add\?search=departed/);

  await expect(page.getByText("The Departed").nth(0)).toBeVisible();
  // Click the first search result
  await page.getByTestId("share-link").nth(0).click();
  await expect(page).toHaveURL(/share\/movie\/\d+/);

  await expect(page).toHaveTitle(/The Departed/);
});

test("search and add", async ({ page }) => {
  await page.goto(BASE_URL + "/add");
  const input = page.getByTestId("add-search");
  await input.fill("departed");
  await input.press("Enter");
  await expect(page).toHaveURL(/add\?search=departed/);

  await expect(page.getByText("The Departed").nth(0)).toBeVisible();
  // Click the first search result
  await page.getByTestId("display-toggle").nth(0).click();

  // Return to the home page and expect it to appear there
  await page.getByTestId("home-link").nth(0).click();
  await expect(page).toHaveURL(BASE_URL + "/");

  await expect(page.getByText("The Departed").nth(0)).toBeVisible();
});
