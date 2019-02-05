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
    page.navigateTo();

    // First we select kainazzo at Baron Inn.
    page.selectLoc('baron-inn');
    expect(page.getDetailsBossAsset(0)).toMatch(/^.*\/assets\/empty\/boss.png$/);
    page.selectBoss('kainazzo');
    expect(page.getDetailsBossAsset(0)).toMatch(/^.*\/assets\/bosses\/kainazzo.png$/);

    // Now verify that antlion is still empty.
    page.selectLoc('antlion');
    expect(page.getDetailsBossAsset(0)).toMatch(/^.*\/assets\/empty\/boss.png$/);
  });

  it('Handles key item picking', () => {
    page.navigateTo();
    page.clearData();
    page.navigateTo();

    // Navigate to flags and enable Kqmt.
    page.clickButton('flags');
    page.clickCheckbox('Kq');
    page.clickCheckbox('Km');
    page.clickCheckbox('Kt');

    // Give us underground access.
    page.selectLoc('intro');
    page.selectKeyItem('magma-key');

    page.selectLoc('feymarch');

    // Check that summon bosses work.
    expect(page.getDetailsBossKeyItemAsset(0)).toMatch(/^.*\/assets\/empty\/key.png$/);
    page.selectKeyItemPicker('boss', 0);
    page.selectPickerKeyItem('crystal');
    expect(page.getDetailsBossKeyItemAsset(0)).toMatch(/^.*\/assets\/key-items\/crystal.png$/);

    // Check that trapped chests work.
    expect(page.getDetailsTrappedChestKeyItemAsset(0)).toMatch(/^.*\/assets\/empty\/key.png$/);
    page.selectKeyItemPicker('trapped', 0);
    page.selectPickerKeyItem('darkness-crystal');
    expect(page.getDetailsTrappedChestKeyItemAsset(0)).toMatch(/^.*\/assets\/key-items\/darkness-crystal.png$/);

    // Check that lunar bosses work.
    page.selectLoc('lunar-subterrane');
    expect(page.getDetailsBossKeyItemAsset(0)).toMatch(/^.*\/assets\/empty\/key.png$/);
    page.selectKeyItemPicker('boss', 0);
    page.selectPickerKeyItem('spoon');
    expect(page.getDetailsBossKeyItemAsset(0)).toMatch(/^.*\/assets\/key-items\/spoon.png$/);

  });
});
