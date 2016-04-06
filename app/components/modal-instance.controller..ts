class ModalInstanceController {
  data: any;
  $modalInstance: any;
  
  constructor(data, $modalInstance) {
    this.data = data;
    this.$modalInstance = $modalInstance;
  }
}

angular.module('crucioApp').controller('ModalInstanceController', ModalInstanceController);
