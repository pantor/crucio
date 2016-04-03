function Cut() {
  return (value, wordwise, max, tail) => {
    if (!value) {
      return '';
    }

    const newMax = parseInt(max, 10);
    if (value.length <= newMax) {
      return value;
    }

    let newValue = value.substr(0, newMax);
    if (wordwise) {
      const lastspace = newValue.lastIndexOf(' ');
      if (lastspace !== -1) {
        newValue = newValue.substr(0, lastspace);
      }
    }

    return newValue + (tail || ' ?');
  };
}

angular.module('crucioApp').filter('cut', Cut);
