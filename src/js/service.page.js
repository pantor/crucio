class Page {
  constructor($window) {
    this.$window = $window;
  }

  setTitle(newTitle) {
    this.title = newTitle;
  }

  setNav(newNav) {
    this.nav = newNav;
  }

  setTitleAndNav(newTitle, newNav = '') {
    this.title = newTitle;
    this.nav = newNav;

    this.$window.document.title = this.title;
  }
}

angular.module('crucioApp').service('Page', Page);
