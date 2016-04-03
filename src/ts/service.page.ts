class Page {
  $window: any;
  title: string;
  nav: string;

  constructor($window) {
    this.$window = $window;
  }

  setTitle(newTitle: string) {
    this.title = newTitle;
  }

  setNav(newNav: string) {
    this.nav = newNav;
  }

  setTitleAndNav(newTitle: string, newNav: string = '') {
    this.title = newTitle;
    this.nav = newNav;

    this.$window.document.title = this.title;
  }
}

angular.module('crucioApp').service('Page', Page);
