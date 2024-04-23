import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200");
});

test.describe("Form Layouts page", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test("input fields", async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" });

    await usingTheGridEmailInput.fill("test@test.com");
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially("test2@test.com", {
      delay: 500,
    });

    //generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual("test2@test.com");

    //locator assertion
    await expect(usingTheGridEmailInput).toHaveValue("test2@test.com");
  });

  test("radio buttons", async ({ page }) => {

    const usingTheGridForm = page.locator("nb-card", { hasText: "Using the Grid" });
    
    await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).check({force: true});
    const radioStatus = await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked();//for generic assertion
    expect(radioStatus).toBeTruthy();
    await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked();//for locator assertion

    await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force:true});
    expect(await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy();//unselected 
    expect(await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy();//selected
  });
});
