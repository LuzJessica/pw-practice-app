import { test } from "@playwright/test";

//it means we will execute this before all suites we have
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

//Here we create a suit of tests that can have more than one test
test.describe("test suite 1", () => {
  //this one will execute before each test inside this suite
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
  });

  test("the first test of this suite", async ({ page }) => {
    await page.getByText("Form Layouts").click();
  });

  test("the second test of this suite", async ({ page }) => {
    await page.getByText("Datepicker").click();
  });
});
