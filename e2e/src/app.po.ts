import { browser, by, element, protractor, until } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  selectLoc(loc: string) {
    let elem = protractor.ExpectedConditions;
    //browser.waitForAngular();
    //browser.wait(elem.visibilityOf(element(by.id(loc))), 6000);
    element(by.id(loc)).click();
  }

  getTitleText() {
    return element(by.css('mat-toolbar span')).getText();
  }
}
