class ModalInstanceController {
  constructor(data, $modalInstance) {
    this.data = data;
    this.$modalInstance = $modalInstance;
  }
}

angular.module('crucioApp').controller('ModalInstanceController', ModalInstanceController);
