import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200");
});

test.describe.only("Form Layouts page", () => {
  test.describe.configure({retries: 2})
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test("input fields", async ({ page }, testInfo) => {
    if(testInfo.retry){
      //do something
    }
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
    expect(inputValue).toEqual("test2@test.com1");

    //locator assertion
    await expect(usingTheGridEmailInput).toHaveValue("test2@test.com");
  });

  test("radio buttons", async ({ page }) => {
    const usingTheGridForm = page.locator("nb-card", {
      hasText: "Using the Grid",
    });

    await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .check({ force: true });
    const radioStatus = await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .isChecked(); //for generic assertion
    expect(radioStatus).toBeTruthy();
    await expect(
      usingTheGridForm.getByRole("radio", { name: "Option 1" })
    ).toBeChecked(); //for locator assertion

    await usingTheGridForm
      .getByRole("radio", { name: "Option 2" })
      .check({ force: true });
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 1" })
        .isChecked()
    ).toBeFalsy(); //unselected
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 2" })
        .isChecked()
    ).toBeTruthy(); //selected
  });

  test("checkboxed", async ({ page }) => {
    await page.getByTitle("Modal & Overlays").click();
    await page.getByTitle("Toastr").click();

    await page
      .getByRole("checkbox", { name: "Hide on click" })
      .uncheck({ force: true });
    await page
      .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
      .check({ force: true });

    const allCheckboxes = page.getByRole("checkbox");
    for (const checkbox of await allCheckboxes.all()) {
      await checkbox.uncheck({ force: true });
      expect(await checkbox.isChecked()).toBeFalsy();
    }
  });

  test("list and dropdowns", async ({ page }) => {
    const dropDownMenu = page.locator(".select-button");
    await dropDownMenu.click();

    page.getByRole("list"); //used when the list has as UL tag
    page.getByRole("listitem"); //used when the list has a LI tag

    const optionList = page.locator("nb-option-list nb-option");
    await expect(optionList).toHaveText([
      "Light",
      "Dark",
      "Cosmic",
      "Corporate",
    ]); //validate the options of the list
    await optionList.filter({ hasText: "Cosmic" }).click(); //it filters one value of the list and select(click) it
    const header = page.locator("nb-layout-header");
    await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");

    const colors = {
      Light: "rgb(255, 255, 255)",
      Dark: "rgb(34, 43, 69)",
      Cosmic: "rgb(50, 50, 89)",
      Corporate: "rgb(255, 255, 255)",
    };

    await dropDownMenu.click();
    for (const color in colors) {
      await optionList.filter({ hasText: color }).click();
      await expect(header).toHaveCSS("background-color", colors[color]);
      if (color != "Corporate") {
        await dropDownMenu.click();
      }
    }
  });

  test("tooltips", async ({ page }) => {
    await page.getByTitle("Modal & Overlays").click();
    await page.getByTitle("Tooltip").click();

    const toolTipCard = page.locator("nb-card", {
      hasText: "Tooltip Placements",
    });
    await toolTipCard.getByRole("button", { name: "TOP" }).hover();

    page.getByRole("tooltip"); //If you have a role tooltip created. Not the case for this project
    const toolTip = await page.locator("nb-tooltip").textContent();
    expect(toolTip).toEqual("This is a tooltip");
  });

  test("dialog boxes", async ({ page }) => {
    await page.getByTitle("Tables & Data").click();
    await page.getByTitle("Smart Table").click();

    page.on("dialog", (dialog) => {
      expect(dialog.message()).toEqual("Are you sure you want to delete?");
      dialog.accept();
    });

    await page
      .getByRole("table")
      .locator("tr", { hasText: "mdo@gmail.com" })
      .locator(".nb-trash")
      .click();
    await expect(page.locator("table tr").first()).not.toHaveText(
      "mdo@gmail.com"
    );
  });

  test("web tables", async ({ page }) => {
    await page.getByTitle("Tables & Data").click();
    await page.getByTitle("Smart Table").click();

    //How to get a row by  any text in this row
    const targetRow = page.getByRole("row", { name: "twitter@outlook.com" }); //use if have unique text
    await targetRow.locator(".nb-edit").click();

    await page.locator("input-editor").getByPlaceholder("Age").clear();
    await page.locator("input-editor").getByPlaceholder("Age").fill("35");
    await page.locator(".nb-checkmark").click();

    //how to get a row based on the value in the specific column
    await page.locator(".ng2-smart-pagination-nav").getByText("2").click();
    const targetRowId = page
      .getByRole("row", { name: "11" })
      .filter({ has: page.locator("td").nth(1).getByText("11") });
    await targetRowId.locator(".nb-edit").click();
    await page.locator("input-editor").getByPlaceholder("E-mail").clear();
    await page
      .locator("input-editor")
      .getByPlaceholder("E-mail")
      .fill("test@test.com");
    await page.locator(".nb-checkmark").click();
    await expect(targetRowId.locator("td").nth(5)).toHaveText("test@test.com");

    //test filter of the table

    //identify testdatas we want to use
    const ages = ["20", "30", "40", "200"];

    for (let age of ages) {
      await page.locator("input-filter").getByPlaceholder("Age").clear();
      await page.locator("input-filter").getByPlaceholder("Age").fill(age);
      await page.waitForTimeout(500);

      const ageRows = page.locator("tbody tr");
      for (let row of await ageRows.all()) {
        const cellValue = await row.locator("td").last().textContent();
        if (age != "200") {
          expect(cellValue).toEqual(age);
        } else expect(cellValue).toEqual(" No data found ");
      }
    }
  });

  test("datepicker", async ({ page }) => {
    await page.getByTitle("Forms").click();
    await page.getByTitle("Datepicker").click();

    const calendarInputField = page.getByPlaceholder("Form Picker");
    await calendarInputField.click();

    let date = new Date();
    date.setDate(date.getDate() + 14);
    const expectedDate = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString("En-US", { month: "short" });
    const expectedMonthLong = date.toLocaleString("En-US", { month: "long" });
    const expectedYear = date.getFullYear();
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    let calendarMonthAndYear = await page
      .locator("nb-calendar-view-mode")
      .textContent();
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `;
    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page
          .locator('nb-calendar-pageable-navigation [data-name="chevron-right"]')
          .click();
        calendarMonthAndYear = await page
          .locator("nb-calendar-view-mode")
          .textContent();
      }

    await page
      .locator('[class="day-cell ng-star-inserted"]')
      .getByText(expectedDate, { exact: true }) //when we look for 1, playwright understand that 10, 11, 12 also has 1 and bring it as possible values so we need to specify we only want the value 1
      .click();

    await expect(calendarInputField).toHaveValue(dateToAssert);
  });
});

test('sliders', async ({page}) => {
  /*update slider attribute
  const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
  await tempGauge.evaluate( node => {
    node.setAttribute('cx', '232.630');
    node.setAttribute('cy', '232.630');
  })
  await tempGauge.click();*/

  //mouse movement
const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
await tempBox.scrollIntoViewIfNeeded();

const box = await tempBox.boundingBox();
const x = box.x + box.width / 2;
const y = box.y + box.height / 2;
await page.mouse.move(x,y);
await page.mouse.down();
await page.mouse.move(x+100, y);
await page.mouse.move(x+100, y+100);
await page.mouse.up();
await expect(tempBox).toContainText('30');











})

