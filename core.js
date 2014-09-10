var _array = require('./core/array'),
    _date = require('./core/date'),
    _function = require('./core/function'),
    _json = require('./core/json'),
    _string = require('./core/string'),
    _math = require('./core/math');

module.exports = {

  evaluate: function(node) {
    var method = node.property.name,
        handler = _array[method] || _date[method] || _function[method] || _json[method] || _string[method] || _math[method];

    return (handler) ? handler(node) : node;
  }

}
