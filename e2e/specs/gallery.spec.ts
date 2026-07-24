import { expect, test } from "@playwright/test";

test.describe("gallery", () => {
  test("filters tricks by category and opens detail pages", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Tiny tricks, big impact." }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Browse Tricks" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open Glassmorphism Card", exact: true }),
    ).toBeVisible();

    await page.getByRole("button", { name: "React" }).click();

    await expect(
      page.getByRole("heading", { name: "React", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: "Open Composition Search (IME)",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: "Open useLocalStorage Hook",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open Glassmorphism Card", exact: true }),
    ).toHaveCount(0);

    await page
      .getByRole("link", {
        name: "Open Composition Search (IME)",
        exact: true,
      })
      .click();

    await expect(
      page.getByRole("heading", { name: "Composition Search (IME)" }),
    ).toBeVisible();
    await expect(page.getByText("Technologies")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Web Tricks/i }).first(),
    ).toBeVisible();
  });

  test("shows a not found state for unknown trick ids", async ({ page }) => {
    await page.goto("/trick/does-not-exist");

    await expect(page.getByText("Trick not found.")).toBeVisible();
  });
});
