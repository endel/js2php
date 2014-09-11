var utils = require('./utils'),
    _array = require('./core/array'),
    _date = require('./core/date'),
    _function = require('./core/function'),
    _json = require('./core/json'),
    _string = require('./core/string'),
    _math = require('./core/math');

module.exports = {

  evaluate: function(node) {
    var method = node.property.name;

    // if (method == "hasOwnProperty") {
    //   var args = utils.clone(node.parent.arguments);
    //   node.parent.arguments = false;
    //   return { type: 'CallExpression', callee: { type: 'Identifier', name: 'isset', }, arguments: args };
    // }

    var handler = _array[method] || _date[method] || _function[method] || _json[method] || _string[method] || _math[method];

    return (handler) ? handler(node) : node;
  }

}
