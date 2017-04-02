class ImageModalController {
  private readonly user: Crucio.User;
  private data: any;
  private resolve: any;
  private close: any;
  private dismiss: any;

  constructor(private readonly API: APIService) {

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
