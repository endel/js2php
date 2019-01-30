var utils = require('./utils'),
    scope = require('./scope'),
    _global = require('./core/global'),
    _array = require('./core/array'),
    _console = require('./core/console'),
    _date = require('./core/date'),
    _function = require('./core/function'),
    _json = require('./core/json'),
    _object = require('./core/object'),
    _regexp = require('./core/regexp'),
    _string = require('./core/string'),
    _math = require('./core/math'),
    _number = require('./core/number');

module.exports = {

  evaluate: function(node) {
    var handler = undefined;

    if (node.object && node.object.type === 'MemberExpression') {
      var newNode = module.exports.evaluate(node.object);
      if (newNode !== node.object) {
        node.object = newNode;
      }
    }
    if (node.object && node.object.type === 'Literal') {
      var method = node.property.name;
      handler = node.object.regex ? _regexp[method] : _string[method];
    } else if (node.object && node.object.type === 'Identifier' && /^(Array|Object|console)$/.test(node.object.name)) {
      var longName = node.object.name + '_' + node.property.name;
      handler = _array[longName] || _object[longName] || _console[longName];
    } else if (node.property) {
      var method = node.property.name;
      // _array should be before _string here so we pick up the correct
      // multitype version of #length and #indexOf
      handler = _array[method] || _date[method] || _function[method] || _json[method] || _string[method] || _math[method] || _number[method];
    } else if (node.callee) {
      handler = _global[node.callee.name];
    }

    if (handler) {
      node = handler(node);
      node.scope = scope.create(node);
    }

    return node;
  }

}
