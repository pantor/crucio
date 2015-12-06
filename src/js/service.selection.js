class Selection {
    constructor() { }

    is_element_included(element, searchDictionary) {
        for (const key in searchDictionary) {
            if (key == 'query') {
                let queryString = '';
                for (const entry of searchDictionary.query_keys) {
                    queryString += element[entry] + ' ';
                }

                const substringArray = searchDictionary.query.toLowerCase().split(' ');
                for (let i = 0, len = substringArray.length; i < len; ++i) {
                    const substring = substringArray[i];
                    if (queryString.toLowerCase().indexOf(substring) < 0 && substring) {
                        return false;
                    }
                }
            } else if (key == 'group') {
                if (searchDictionary.group != element.group_name && searchDictionary.group) {
                    return false;
                }
            } else if (key != 'query_keys') {
                if (searchDictionary[key] != element[key] && searchDictionary[key]) {
                    return false;
                }
            }
        }
        return true;
    }

    count(list, searchDictionary) {
        if (!list) {
            return 0;
        }

        let counter = 0;
        for (const entry of list) {
            if (this.is_element_included(entry, searchDictionary)) {
                counter++;
            }
        }

        return counter;
    }

    find_distinct(list, searchKey) {
        const result = [];
        for (const entry of list) {
            if (result.indexOf(entry[searchKey]) === -1) {
                result.push(entry[searchKey]);
            }
        }
        result.sort();
        return result;
    }
}

angular.module('crucioApp').service('Selection', Selection);
