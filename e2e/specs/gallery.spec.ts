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

  test("searches tricks by title, category, technologies tag, and description keywords", async ({
    page,
  }) => {
    await page.goto("/");

    const searchInput = page.getByRole("textbox", { name: "Search tricks" });
    await expect(searchInput).toBeVisible();

    // 1. Search by title keyword
    await searchInput.fill("Miro");
    await expect(
      page.getByRole("link", {
        name: "Open Miro-like Sticky Note Canvas",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open Glassmorphism Card", exact: true }),
    ).toHaveCount(0);

    // 2. Search by technology tag
    await searchInput.fill("Tailwind");
    await expect(
      page.getByRole("link", {
        name: "Open Miro-like Sticky Note Canvas",
        exact: true,
      }),
    ).toBeVisible();

    // 3. Search by description keyword
    await searchInput.fill("zooming");
    await expect(
      page.getByRole("link", {
        name: "Open Apple-like Scroll Animations",
        exact: true,
      }),
    ).toBeVisible();

    // 4. Clear search
    await page
      .getByRole("button", { name: "Clear search", exact: true })
      .click();
    await expect(searchInput).toHaveValue("");
    await expect(
      page.getByRole("link", { name: "Open Glassmorphism Card", exact: true }),
    ).toBeVisible();

    // 5. Search non-existent keyword for empty state
    await searchInput.fill("nonexistenttrickkeyword");
    await expect(page.getByText("No matching tricks found")).toBeVisible();
    await page.getByRole("button", { name: "Clear search & filters" }).click();
    await expect(searchInput).toHaveValue("");
  });
});
