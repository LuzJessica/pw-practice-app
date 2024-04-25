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

  test('checkboxed', async ({ page }) => {

    await page.getByTitle('Modal & Overlays').click();
    await page.getByTitle('Toastr').click();

    await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force:true});
    await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force:true});

    const allCheckboxes = page.getByRole('checkbox');
    for(const checkbox of await allCheckboxes.all()){
        await checkbox.uncheck({force:true});
        expect(await checkbox.isChecked()).toBeFalsy();
    }
  })

  test('list and dropdowns', async ({ page }) => {

    const dropDownMenu = page.locator('.select-button');
    await dropDownMenu.click()

    page.getByRole('list'); //used when the list has as UL tag
    page.getByRole('listitem');//used when the list has a LI tag

    const optionList = page.locator('nb-option-list nb-option');
    await(expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]));//validate the options of the list
    await optionList.filter({hasText: "Cosmic"}).click();//it filters one value of the list and select(click) it
    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)');

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)",
    }

    await dropDownMenu.click();
    for(const color in colors){
        await optionList.filter({hasText: color}).click();
        await expect(header).toHaveCSS('background-color', colors[color]);
        if(color != 'Corporate'){
            await dropDownMenu.click();
        }
        
    }

  })

  test('tooltips', async ({ page }) => {

    await page.getByTitle('Modal & Overlays').click();
    await page.getByTitle('Tooltip').click();

    const toolTipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'});
    await toolTipCard.getByRole('button', {name: 'TOP'}).hover();

    page.getByRole('tooltip')//If you have a role tooltip created. Not the case for this project
    const toolTip = await page.locator('nb-tooltip').textContent();
    expect(toolTip).toEqual('This is a tooltip');

  })

  test('dialog boxes', async ({page}) => {
    await page.getByTitle('Tables & Data').click();
    await page.getByTitle('Smart Table').click();
    

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?');
        dialog.accept();
    })

    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click();
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');

  })

});
