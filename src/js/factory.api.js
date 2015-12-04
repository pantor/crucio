angular.module('crucioApp')
    .factory('API', function($http) {
        var api_base = 'api/v1/';

        return {
            get: function(path, data) {
			    return $http.get(api_base + path, {params: data});
		    },
    		post: function(path, data) {
                return $http.post(api_base + path, data);
    		},
    		put: function(path, data) {
                return $http.put(api_base + path, data);
    		},
    		delete: function(path, data) {
                return $http.delete(api_base + path, {params: data});
    		}
	    };
    });
