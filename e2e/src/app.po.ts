import { browser, by, element, protractor, until } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  clearData() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
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
}
