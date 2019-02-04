import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('Root title should be Cid\'s Workshop', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Cid\'s Workshop');
  });

  it('Baron in title', () => {
    page.navigateTo();
    page.selectLoc('baron-inn');
    expect(page.getTitleText()).toEqual('Baron Inn');
  });
});
