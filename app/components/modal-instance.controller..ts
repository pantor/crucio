class ModalInstanceController {
  data: any;
  $uibModalInstance: any;

  constructor(data, $uibModalInstance) {
    this.data = data;
    this.$uibModalInstance = $uibModalInstance;
  }
}

angular.module('crucioApp').controller('ModalInstanceController', ModalInstanceController);
