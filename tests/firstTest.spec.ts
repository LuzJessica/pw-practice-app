import { test } from "@playwright/test";
import { first } from "rxjs-compat/operator/first";

//it means we will execute this before all suites we have
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
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




