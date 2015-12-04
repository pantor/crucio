angular.module('crucioApp')
    .factory('Selection', function() {
        return {
            is_element_included: function(element, search_dictionary) {
        		for (var key in search_dictionary) {
        			if (key == 'query') {
        				var query_string = '';
        				search_dictionary.query_keys.forEach(function(query_key) {
        				    query_string += element[query_key] + ' ';
        				});
        
        				var substring_array = search_dictionary.query.toLowerCase().split(' ');
        				for (var i = 0, len = substring_array.length; i < len; ++i) {
        					var substring = substring_array[i];
        					if (query_string.toLowerCase().indexOf(substring) < 0 && substring)
        					    return false;
        				}
        
        			} else if (key == 'group') {
        				if (search_dictionary.group != element.group_name && search_dictionary.group) 
        				    return false;
        			} else if (key != 'query_keys') {
        				if (search_dictionary[key] != element[key] && search_dictionary[key])
        				    return false;
        			}
        		}
        		return true;
        	},
        	count: function(list, search_dictionary) {
        		if (!list)
        		    return 0;
        
        		var counter = 0;
        		for (var i = 0; i < list.length; i++) {
            		if (this.is_element_included(list[i], search_dictionary))
        			    counter++;
        		}
        
        		return counter;
        	},
        	find_distinct: function(list, search_key) {
        		var result = [];
        		list.forEach(function(entry) {
        			if (-1 == result.indexOf(entry[search_key]))
        				result.push(entry[search_key]);
        		});
        		result.sort();
        		return result;
        	}
        };
    });