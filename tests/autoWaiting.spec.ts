import { test, expect } from "@playwright/test"

test('alternative waits', async({page}) => {
    const successButton = page.locator('.bg_success');
  
    //wait for element
    await page.waitForSelector('.bg_success')

    //wait for particular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //wait for network call to be completede (NOT RECOMENDED!)
    await page.waitForLoadState('networkidle');

    const text = await successButton.allTextContents();
    expect(text).toContain('Data loaded with AJAX get request.')
  })