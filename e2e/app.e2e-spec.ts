import { StarterkitAngular2FirebasePage } from './app.po';

describe('starterkit-angular2-firebase App', () => {
  let page: StarterkitAngular2FirebasePage;

  beforeEach(() => {
    page = new StarterkitAngular2FirebasePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
