class Page {
    constructor() {
        this.title = 'Crucio';
        this.nav = '';
    }

    setTitle(newTitle) {
        this.title = newTitle;
    }

    setNav(newNav) {
        this.nav = newNav;
    }

    setTitleAndNav(newTitle, newNav) {
        this.title = newTitle;
        this.nav = newNav;
    }
}

angular.module('crucioApp').service('Page', Page);
