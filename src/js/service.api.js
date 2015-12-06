class API {
    constructor($http) {
        this.$http = $http;

        this.api_base = 'api/v1/';
    }

    get(path, data) {
        return this.$http.get(this.api_base + path, { params: data });
    }

    post(path, data) {
        return this.$http.post(this.api_base + path, data);
    }

    put(path, data) {
        return this.$http.put(this.api_base + path, data);
    }

    delete(path, data) {
        return this.$http.delete(this.api_base + path, { params: data });
    }
}

angular.module('crucioApp').service('API', API);
