import { test, expect } from "@playwright/test";
import { first } from "rxjs-compat/operator/first";

//it means we will execute this before all suites we have
test.beforeEach(async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
  testInfo.setTimeout(testInfo.timeout + 2000);//applied on every test on this particular test suite
});

test('Locator syntax rules', async({page}) => {
  //By Tag Name
  await page.locator('input').first().click();//if we use the tag name, it's important to inform which element with this tag name we want because we can find many

  //By ID
  await page.locator('#inputEmail1').click();

  //By Class value
  await page.locator('.shape-rectangle').first().click();

  //By Attribute
  page.locator('[placeholder="Email"]')

  //By full Class value
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

  //Combining different selector
  page.locator('input[placeholder="Email"][nbinput]')//DO NOT add space between selectors in this case!!

  //By XPath (NOT RECOMMENDED)
  page.locator('//*[@id="inputEmail1"]')

  //By Partial text match
  page.locator(':text("Using")')

  //By exact text Match
  page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async ({page}) => {
  
  //By Role
  await page.getByRole('textbox', {name: "Email"}).first().click();
  await page.getByRole('button', {name: "Sign in"}).first().click();

  //By Label
  await page.getByLabel('Email').first().click();

  //By Place Holder
  await page.getByPlaceholder('Jane Doe').click();

  //By Text
  await page.getByText('Using the Grid').click();

  //By Title
  await page.getByTitle('IoT Dashboard').click();

})

test('locating child elements', async({page}) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();// in this case we need to use space
  await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click();

  await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click();

  //await page.locator('nb.card').nth(3).getByRole('button').click();//avoid use nth to select elements because they can change order and we can access other element instead
})

test('locating parent elements', async({page}) => {
  await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click();
  await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click();

  await page.locator('nb-card').filter({hasText: "Basic Form"}).getByRole('textbox', {name: "Email"}).click();
  await page.locator('nb-card').filter({has: page.locator('#exampleInputEmail1')}).getByRole('textbox', {name: "Email"}).click();

  await page.locator('nb-card').filter({has:page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click();

  await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click();

  await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click();//possible but not recommended
})

test('Reusing the locators', async ({page}) => {
  
  const basicForm = page.locator('nb-card', {hasText: "Basic form"});
  const emailField = basicForm.getByRole('textbox', {name: "Email"});
  const passwordField = basicForm.getByRole('textbox', {name: "Password"});
  const checkMeOutCheckBox = basicForm.locator('.custom-checkbox');
  const submitButton = basicForm.getByRole('button');
  

  await emailField.fill('test@test.com');
  await passwordField.fill('Test123');
  await checkMeOutCheckBox.click();
  await submitButton.click();

  await expect(emailField).toHaveValue('test@test.com');
})

test ('extracting values', async ({page}) => {
  //single test value
  const basicForm = page.locator('nb-card').filter({hasText: "Basic form"});
  const buttonText = await basicForm.locator('button').textContent();

  //all text values
  const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents();
  expect(allRadioButtonsLabels).toContain('Option 1');

  //input value
  const emailField = basicForm.getByRole('textbox', {name:'Email'});
  await emailField.fill('test@test.com');
  const emailValue = await emailField.inputValue();
  expect (emailValue).toEqual('test@test.com');

  const placeHolderValue = await emailField.getAttribute('placeholder');
  expect(placeHolderValue).toEqual('Email');

})

test ('assertions', async ({page}) => {

  //General assertions
  const value = 5;
  expect(value).toEqual(5);
  
  const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button');
  const text = await basicFormButton.textContent();
  expect(text).toEqual('Submit');

  //Locator assertion
  await expect(basicFormButton).toHaveText('Submit');

  //Soft assertions - For this case even if the test fails, next text will run
  //await expect.soft(basicFormButton).toHaveText('Submit5');
  await basicFormButton.click()
})






