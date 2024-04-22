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

  test('timeouts', async ({page}) => {
    //test.setTimeout(10000); limitating timeout for this specific testcase
    test.slow()//it increases the timeout limitation in 3 times, based on timeout configured on config file or the default (30 seconds)
    const successButton = page.locator('.bg_success');
    await successButton.click({timeout: 16000});//It overrides the timeout config in playwright config file 
  })