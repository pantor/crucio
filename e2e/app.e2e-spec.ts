import { CrucioPage } from './app.po';

describe('crucio App', () => {
  let page: CrucioPage;

  beforeEach(() => {
    page = new CrucioPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
