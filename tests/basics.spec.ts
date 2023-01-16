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

const googleAuth = async (page: Page) => {
  await page.goto(BASE_URL + "/");
  await page.getByTestId("nav-auth").nth(0).click();
  await page.getByTestId("auth-google").click();
  await expect(page).toHaveURL(/emulator\/auth\/handler/);
  const button = page.getByText("Add new account");
  await expect(button).toBeVisible();
  await page.getByText("Add new account").click();
  await page.getByText("Auto-generate user information").click();
  await page.locator("css=#profile-photo-input").fill(PHOTO_URL);
  await page.getByText("Sign in with").click();

  await expect(page).toHaveURL(BASE_URL + "/signin");
  await expect(page.getByText("Signed in")).toBeVisible();
};

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
