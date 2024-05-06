import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";



test.beforeEach(async ({ page }, testInfo) => {
  await page.goto("http://localhost:4200/");
});

test('navigate to form page', async({page}) => {
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
    await pm.navigateTo().formLayoutsPage();
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndOption('tst@test.com', 'Welcome1', 'Option 1');
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox('Jéssica Luz', 'jessicaluz@test.com', true);
    await pm.navigateTo().datePickerPage();  
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(14);
    await pm.onDatepickerPage().selectDatepickerWithRange(6,15);
})