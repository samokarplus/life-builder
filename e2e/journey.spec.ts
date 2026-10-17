import { test, expect } from "@playwright/test";

async function ready(page: import("@playwright/test").Page, path: string) {
  await page.goto(path);
  await expect(page.getByRole("status", { name: "Loading your plan" })).toHaveCount(0);
}
async function saved(page: import("@playwright/test").Page) {
  await expect(page.getByText(/^Saved/).first()).toBeVisible();
  await page.waitForTimeout(800);
}

test("FRCC to CU Boulder to counselor: one connected journey in the Action Center", async ({ page }) => {
  // The student states their dream once, in their profile.
  await ready(page, "/profile");
  await page.getByLabel("Dream career", { exact: true }).fill("Licensed Professional Counselor");
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await saved(page);

  await ready(page, "/next-steps");
  await expect(page.getByRole("heading", { name: "Licensed Professional Counselor in Colorado" })).toBeVisible();
  await expect(page.getByText(/CU Boulder · Philosophy/)).toBeVisible();

  // Recommendations come from verified data and the plan, each with a reason and a source.
  await expect(page.getByRole("heading", { name: /Fall early-notification deadline/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Ask CU Boulder which of your FRCC courses will transfer/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Looking ahead: CU Denver/ })).toBeVisible();
  await expect(page.getByText("Eligibility unknown").first()).toBeVisible();

  // Save it, add a note and a date, move it along.
  const card = page.getByRole("listitem").filter({ has: page.getByRole("heading", { name: /Ask CU Boulder which of your FRCC courses will transfer/ }) });
  await card.getByRole("button", { name: "Save", exact: true }).click();
  await card.getByRole("button", { name: /Add note or date/ }).click();
  await card.getByLabel(/Notes/).fill("Email CU Boulder transfer advising");
  await card.getByLabel(/Notes/).blur();
  await card.getByLabel(/Due date/).fill("2026-11-15");
  await card.getByRole("button", { name: "Start", exact: true }).click();
  await card.getByRole("button", { name: "Waiting for response", exact: true }).click();
  await saved(page);

  // It persists, shows under Waiting on, and keeps the note.
  await ready(page, "/next-steps");
  await page.getByRole("button", { name: /^Waiting/ }).click();
  const waiting = page.getByRole("listitem").filter({ has: page.getByRole("heading", { name: /Ask CU Boulder which of your FRCC courses will transfer/ }) });
  await expect(waiting).toBeVisible();
  await expect(waiting.getByText("Nov 15, 2026", { exact: false })).toBeVisible();

  // Complete, then reopen.
  await waiting.getByRole("button", { name: "Mark done", exact: true }).click();
  await page.getByRole("button", { name: /^Completed/ }).click();
  const done = page.getByRole("listitem").filter({ has: page.getByRole("heading", { name: /Ask CU Boulder which of your FRCC courses will transfer/ }) });
  await expect(done.getByRole("button", { name: "Reopen" })).toBeVisible();
  await done.getByRole("button", { name: "Reopen" }).click();
  await page.getByRole("button", { name: /^In progress/ }).click();
  await expect(page.getByRole("heading", { name: /Ask CU Boulder which of your FRCC courses will transfer/ })).toBeVisible();
});

test("dismiss, bring back, add your own action, and save an opportunity", async ({ page }) => {
  await ready(page, "/profile");
  await page.getByLabel("Dream career", { exact: true }).fill("nurse");
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await saved(page);
  await ready(page, "/next-steps");

  const first = page.getByRole("listitem").filter({ has: page.getByRole("heading", { name: /Next on your Nurse route/ }) });
  await first.getByRole("button", { name: "Dismiss", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Next on your Nurse route/ })).toHaveCount(0);
  await page.getByRole("button", { name: /^Dismissed/ }).click();
  await page.getByRole("button", { name: "Bring it back" }).click();
  await page.getByRole("button", { name: /^To do/ }).click();
  await expect(page.getByRole("heading", { name: /Next on your Nurse route/ })).toBeVisible();

  await page.getByLabel(/What do you want to do/).fill("Call FRCC nursing advising");
  await page.getByRole("button", { name: "Add action", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Call FRCC nursing advising" })).toBeVisible();
  await page.getByRole("button", { name: "Add action", exact: true }).click();
  await expect(page.getByText("Give the action a short title.")).toBeVisible();

  const opp = page.getByRole("region", { name: "Opportunities that may fit you" }).getByRole("listitem").filter({ hasText: "FAFSA (Free Application for Federal Student Aid)" }).first();
  await opp.getByRole("button", { name: "Save to my actions" }).click();
  await expect(opp.getByRole("button", { name: "Saved to actions" })).toBeDisabled();
  await saved(page);
  await ready(page, "/next-steps");
  await expect(page.getByRole("heading", { name: /Look into: FAFSA/ })).toBeVisible();
});

test("choosing a route in Colorado Dreams sets the goal, and the dashboard shows next steps", async ({ page }) => {
  await ready(page, "/paths?path=electrician-colorado");
  await page.getByRole("button", { name: "Build my Electrician path" }).click();
  await expect(page.getByRole("button", { name: "This is your goal" })).toBeVisible();
  await saved(page);
  await ready(page, "/overview");
  await expect(page.getByRole("heading", { name: "Your next steps" })).toBeVisible();
  await page.getByRole("link", { name: /Open Next Steps/ }).click();
  await expect(page.getByRole("heading", { name: "Electrician in Colorado" })).toBeVisible();
});
