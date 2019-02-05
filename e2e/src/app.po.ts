import { browser, by, element, protractor, until } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  clickButton(id: string) {
    return element(by.css(`button#${id}`)).click();
  }

  clickCheckbox(id: string) {
    return element(by.css(`mat-checkbox#${id}`)).click();
  }

  clearData() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  }

  selectKeyItem(ki: string) {
    return element(by.css(`app-key-item#${ki}`)).click();
  }

  selectPickerKeyItem(ki: string) {
    element(by.css(`app-key-item-picker-dialog app-key-item#${ki}`)).click();
    browser.sleep(100);
  }

  selectKeyItemPicker(type: string, index: number) {
    return element.all(by.css(`mat-card-content .${type} app-key-item-picker img`)).get(index).click();
  }

  selectBoss(boss: string) {
    return element(by.css(`app-boss#${boss}`)).click();
  }

  selectLoc(loc: string) {
    return element(by.css(`app-location-summary#${loc}`)).click();
  }

  getTitleText() {
    return element(by.css('mat-toolbar span')).getText();
  }

  getDetailsBossAsset(index: number) {
    return element.all(by.css('mat-card-content tr.boss app-poi img')).get(index).getAttribute('src');
  }

  getDetailsBossKeyItemAsset(index: number) {
    return element.all(by.css('mat-card-content tr.boss app-key-item-picker img')).get(index).getAttribute('src');
  }

  getDetailsTrappedChestKeyItemAsset(index: number) {
    return element.all(by.css('mat-card-content div.trapped app-key-item-picker img')).get(index).getAttribute('src');
  }
}
