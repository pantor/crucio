class Page {
  $window: any;
  title: string;
  nav: string;

  constructor($window) {
    this.$window = $window;
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

angular.module('crucioApp').service('Page', Page);
