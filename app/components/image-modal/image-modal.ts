class ImageModalController {
  readonly API: APIService;
  user: Crucio.User;
  data: any;
  resolve: any;
  close: any;
  dismiss: any;

  constructor(API: APIService) {
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
