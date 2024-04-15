import { test } from "@playwright/test";

test.describe("test suite 1",  () => {//Here we create a suit of tests that can have more than one test
  test("the first test of this suite", async ({page}) => {
    await page.goto('http://localhost:4200/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  });

  test("the second test of this suite", () => {
    
  });
});
