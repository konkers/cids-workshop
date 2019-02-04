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

  it('doesn\'t mix bosses', () => {
    page.navigateTo();
    page.clearData();

    // First we select kainazzo at Baron Inn.
    page.selectLoc('baron-inn');
    expect(page.getDetailsBossAsset(0)).toMatch(/^.*\/assets\/empty\/boss.png$/);
    page.selectBoss('kainazzo');
    expect(page.getDetailsBossAsset(0)).toMatch(/^.*\/assets\/bosses\/kainazzo.png$/);

    // Now verify that antlion is still empty.
    page.selectLoc('antlion');
    expect(page.getDetailsBossAsset(0)).toMatch(/^.*\/assets\/empty\/boss.png$/);
  });
});
