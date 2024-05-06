import { Page } from "@playwright/test";

export class NavigationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async formLayoutsPage() {
    
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Form Layout").click();
  }

  async datePickerPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByTitle("Datepicker").click();
  }

  async smartTablePage() {
    await this.selectGroupMenuItem("Tables & Data");
    await this.page.getByTitle("Smart Table").click();
  }

  async toastrPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByTitle("Toastr").click();
  }

  async tooltipPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByTitle("Tooltip").click();
  }

  private async selectGroupMenuItem(groupdItemTitle: string){
    const groupMenuItem = this.page.getByTitle(groupdItemTitle);
    const expendedState = await groupMenuItem.getAttribute('aria-expanded');
    if(expendedState == "false"){
        await groupMenuItem.click();
    }
  }
}
