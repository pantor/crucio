class ImageModalController {
  readonly API: API;
  user: Crucio.User;
  data: any;
  resolve: any;
  close: any;
  dismiss: any;

  constructor(API: API) {
    this.API = API;
  }

  $onInit() {
    this.data = this.resolve.data;
  }
}

angular.module('crucioApp').component('imageModalComponent', {
  templateUrl: 'app/components/image-modal/image-modal.html',
  controller: ImageModalController,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  }
});
