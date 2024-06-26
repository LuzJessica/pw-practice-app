import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class FormLayoutsPage extends HelperBase{

    constructor(page: Page) {
      super(page)
    }

    /**
     * This method will out the User Grid form with user details
     * @param email - should e a valid email for test user
     * @param password - the password wanted
     * @param optionText - should be one of the options seen in the grid, in this case Option 1 or Option 2
     */

    async submitUsingTheGridFormWithCredentialsAndOption(email: string, password: string, optionText: string){
        const usingTheGridForm = this.page.locator("nb-card", { hasText: "Using the Grid" });
        await usingTheGridForm.getByRole('textbox', {name: 'Email'}).fill(email);
        await usingTheGridForm.getByRole('textbox', {name: 'Email'}).fill(password);
        await usingTheGridForm.getByRole('radio', {name: optionText}).check({force:true});
        await usingTheGridForm.getByRole('button').click()


    }

    /**
     * This method will out the inline form with user details
     * @param name - should be the first and the last name
     * @param email - should be a valida email for test user
     * @param rememberMe - true or false if user session need to be saved
     */
    async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean){
        const inlineForm = this.page.locator('nb-card', {hasText: "Inline form"});
        await inlineForm.getByRole('textbox', {name: 'Jane Doe'}).fill(name);
        await inlineForm.getByRole('textbox', {name: 'Email'}).fill(email);
        if(rememberMe){
            await inlineForm.getByRole('checkbox').check({force: true});
        }
        await inlineForm.getByRole('button').click();

    }
}
