class PageService {
  public title: string;
  public nav: string;

  constructor(private readonly $window: angular.IWindowService) {

  }

  setTitle(newTitle: string): void {
    this.title = newTitle;
  }

  setNav(newNav: string): void {
    this.nav = newNav;
  }

  setTitleAndNav(newTitle: string, newNav: string = ''): void {
    this.title = newTitle;
    this.nav = newNav;

    this.$window.document.title = this.title;
  }
}

angular.module('crucioApp').service('Page', PageService);
