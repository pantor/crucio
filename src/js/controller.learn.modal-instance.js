class ModalInstanceController {
    constructor(image_url, $modalInstance) {
        this.image_url = image_url;
        this.$modalInstance = $modalInstance;
    }
}

angular.module('learnModule').controller('ModalInstanceController', ModalInstanceController);
