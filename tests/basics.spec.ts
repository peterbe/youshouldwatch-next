import type { Page } from "@playwright/test";
import { test, expect } from "@playwright/test";

// import type { TestInfo } from "@playwright/test";
// export async function screenshotOnFailure(
//   { page }: { page: Page },
//   testInfo: TestInfo
// ) {
//   console.log({
//     "testInfo.status": testInfo.status,
//     "testInfo.expectedStatus": testInfo.expectedStatus,
//   });

//   if (testInfo.status !== testInfo.expectedStatus) {
//     // Get a unique place for the screenshot.
//     const screenshotPath = testInfo.outputPath(`failure.png`);
//     // Add it to the report.
//     testInfo.attachments.push({
//       name: "screenshot",
//       path: screenshotPath,
//       contentType: "image/png",
//     });
//     // Take the screenshot itself.
//     await page.screenshot({ path: screenshotPath, timeout: 5000 });
//   }
// }

// test.afterEach(screenshotOnFailure);

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const PHOTO_URL = "http://localhost:3000/face.png";

test("home page", async ({ page }) => {
  await page.goto(BASE_URL + "/");
  await expect(page).toHaveTitle(/You Should Watch/);
});

test("go to add page", async ({ page }) => {
  await page.goto(BASE_URL + "/");
  await page.getByTestId("nav-add").click();
  await expect(page).toHaveURL(/add/);
});

test("search and goto", async ({ page }) => {
  await page.goto(BASE_URL + "/add");
  const input = page.getByTestId("add-search");
  await input.fill("departed");
  await input.press("Enter");
  await expect(page).toHaveURL(/add\?search=departed/);

  await expect(page.getByText("The Departed").nth(0)).toBeVisible();
  // Click the first search result
  await page.getByTestId("goto-link").nth(0).click();
  await expect(page).toHaveURL(/share\/movie\/\d+/);

  await expect(page).toHaveTitle(/The Departed/);
});

test("search and share", async ({ page }) => {
  await page.goto(BASE_URL + "/add");
  const input = page.getByTestId("add-search");
  await input.fill("forrest gump");

  await expect(page.getByText("Forrest Gump").nth(0)).toBeVisible();
  // Click the first search result
  await page.getByTestId("display-web-share").nth(0).click();
  await expect(page.getByText("Share!")).toBeVisible();
  await expect(page.getByText("Copy link to clipboard")).toBeVisible();
  await page.getByText("Copy link to clipboard").click();
  await expect(page.getByText("Copied!")).toBeVisible();
  await page.getByText("Close").click();
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

test("type search and blur the input", async ({ page }) => {
  await page.goto(BASE_URL + "/");
  await page.getByTestId("nav-add").click();
  const input = page.getByTestId("add-search");
  await input.fill("departed");
  await input.blur(); // Not the lack of .press("Enter")
  await expect(page).toHaveURL(/add\?search=departed/);
  await page.goBack();
  await expect(page).toHaveURL(BASE_URL + "/");
});

test("authenticate with Firebase emulator auth", async ({ page }) => {
  await googleAuth(page);
  await expect(page.getByTestId("nav-signed-in")).toBeVisible();
});

test("auth and sign out", async ({ page }) => {
  await googleAuth(page);
  await page.goto(BASE_URL + "/signin");
  await page.getByText("Sign out").click();
  await expect(page.getByTestId("nav-auth")).toBeVisible();
});

test("add to temporary list, then sign in", async ({ page }) => {
  await page.goto(BASE_URL + "/add");
  const input = page.getByTestId("add-search");
  await input.fill("departed");
  await input.press("Enter");
  await expect(page.getByText("The Departed").nth(0)).toBeVisible();
  await page.getByTestId("display-toggle").nth(0).click();
  await page.goto(BASE_URL + "/");
  await expect(page.getByText("The Departed").nth(0)).toBeVisible();

  await googleAuth(page);
  await page.goto(BASE_URL + "/");
  const title = page.getByText("The Departed");
  await expect(title).toBeVisible();
  const mentions = await title.count();
  expect(mentions).toBe(1);
});

test("sign in, add to list, check off, view archive", async ({ page }) => {
  await googleAuth(page);
  await page.goto(BASE_URL + "/add");
  const input = page.getByTestId("add-search");
  await input.fill("forrest gump");
  await input.press("Enter");
  await expect(page.getByText("Forrest Gump").nth(0)).toBeVisible();

  await page.getByText("Add to my list").nth(0).click();
  await page.getByTestId("home-link").click();
  await expect(page.getByText("Forrest Gump").nth(0)).toBeVisible();
  await page.getByText("Check off").click();

  await expect(page.getByText("Forrest Gump").nth(0)).not.toBeVisible();
  await page.getByText("Show previously checked off").click();
  await expect(page.getByText("Forrest Gump").nth(0)).toBeVisible();
  await page.getByText("Close previously checked off").click();
  await expect(page.getByText("Forrest Gump").nth(0)).not.toBeVisible();
});

async function googleAuth(page: Page) {
  await page.goto(BASE_URL + "/");
  await page.getByTestId("nav-auth").nth(0).click();
  await page.getByTestId("auth-google").click();
  await expect(page).toHaveURL(/emulator\/auth\/handler/);

  const button = page.getByText("Add new account");
  await expect(button).toBeVisible();

  // This is important because sometimes even if the button is present,
  // clicking on it might not do anything because the click event handler
  // might not be ready. Ugh, something about the emulator auth UI is weird.
  await page.waitForLoadState("networkidle");

  await button.click();
  await page.getByText("Auto-generate user information").click();
  await page.locator("css=#profile-photo-input").fill(PHOTO_URL);
  await page.getByText("Sign in with").click();

  await expect(page).toHaveURL(BASE_URL + "/signin");
  await expect(page.getByText("Signed in")).toBeVisible();
}
