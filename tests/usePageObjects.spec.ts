import { test, expect } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage"
import { FormLayoutsPage } from "../page-objects/formLayoutPage";



test.beforeEach(async ({ page }, testInfo) => {
  await page.goto("http://localhost:4200/");
});

test('navigate to form page', async({page}) => {
    const navigateTo = new NavigationPage(page);
    await navigateTo.formLayoutsPage();
    await navigateTo.datePickerPage();
    await navigateTo.smartTablePage();
    await navigateTo.tooltipPage();
    await navigateTo.toastrPage();
    
})

test('parametrized methods', async({page}) => {
    const navigateTo = new NavigationPage(page);
    const onFormLayoutsPage = new FormLayoutsPage(page);

    await navigateTo.formLayoutsPage();
    await onFormLayoutsPage.submitUsingTheGridFormWithCredentialsAndOption('tst@test.com', 'Welcome1', 'Option 1');
    await onFormLayoutsPage.submitInlineFormWithNameEmailAndCheckbox('Jéssica Luz', 'jessicaluz@test.com', true);
})