import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { faker } from '@faker-js/faker'



test.beforeEach(async ({ page }, testInfo) => {
  await page.goto("/");
});

test('navigate to form page @smoke', async({page}) => {
    const pm = new PageManager(page);
    pm.navigateTo();
    await pm.navigateTo().formLayoutsPage();
    await pm.navigateTo().datePickerPage();
    await pm.navigateTo().smartTablePage();
    await pm.navigateTo().tooltipPage();
    await pm.navigateTo().toastrPage();
    
})

test('parametrized methods', async({page}) => {
    const pm = new PageManager(page);
    const randomName = faker.name.firstName('female');
    const randomEmail = `${randomName.replace(' ','')}${faker.random.numeric(4)}@test.com`;

    await pm.navigateTo().formLayoutsPage();
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndOption('tst@test.com', 'Welcome1', 'Option 1');
    await page.screenshot({path: 'screenshots/formsLayoutsPage.png'}) //screenshot of entire window
    const buffer = await page.screenshot();
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomName, randomEmail, true);
    await page.locator('nb-card', {hasText: 'Inline form'}).screenshot({path: 'screenshots/inlineForm.png'})//screenshot of specific area
    await pm.navigateTo().datePickerPage();  
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(14);
    await pm.onDatepickerPage().selectDatepickerWithRange(6,15);
})