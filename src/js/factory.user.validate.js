angular.module('userModule')
	.factory('Validate', function(API) {
		var whitelist = [];
		API.get('whitelist').success(function(data) {
			whitelist = data.whitelist;
		});
        
        return {
            email: function(email) {
    			var regex = /[\wäüöÄÜÖ]*@studserv\.uni-leipzig\.de$/;
    			// var regex = /med\d\d\D\D\D@studserv\.uni-leipzig\.de/; // Nur Medi
    
    			if (0 === whitelist.length)
    				return true;
    
    			if (regex.test(email))
    				return true;
    
    			for (var i = 0; i < whitelist.length; i++) {
    				if (whitelist[i].mail_address == email)
    					return true;
    			}
    			return false;
    		},
    		password: function(password) {
    			if (!password)
    				return false;
    			if (6 > password.length)
    				return false;
    			return true;
    		},
    		non_empty: function(text) {
    			if (0 === text.length)
    				return false;
    			return true;
    		}
        };
	});