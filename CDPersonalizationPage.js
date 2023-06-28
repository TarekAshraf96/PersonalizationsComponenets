class CDPersonalizationPage {
  constructor(page, context) {
    // locators
    this.page = page;
    this.context = context;
  }

  async checkTileIsVisible(tile) {
    return this.page.locator(`//div[contains(@class,'dozen-tile-component')]//h3[contains(text(),'${tile}')]`).isVisible();
  }
}
export default CDPersonalizationPage;
