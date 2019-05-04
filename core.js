var utils = require('./utils'),
    scope = require('./scope'),
    _global = require('./core/global'),
    _array = require('./core/array'),
    _console = require('./core/console'),
    _date = require('./core/date'),
    _function = require('./core/function'),
    _json = require('./core/json'),
    _object = require('./core/object'),
    _promise = require('./core/promise'),
    _regexp = require('./core/regexp'),
    _string = require('./core/string'),
    _math = require('./core/math'),
    _number = require('./core/number');

module.exports = {

  evaluate: function(node) {
    var handler = undefined;
    var get = function(obj, name) {
      if (obj.hasOwnProperty(name)) { return obj[name]; }
      return undefined;
    };

    if (utils.isType(node.object, 'MemberExpression')) {
      var newNode = module.exports.evaluate(node.object);
      if (newNode !== node.object) {
        node.object = newNode;
        newNode.parent = node;
      }
    }

    // Handle Array.prototype.slice.call(...)
    if (utils.isId(node.property, 'call') &&
        utils.isType(node.object, 'MemberExpression') &&
        utils.isType(node.object.object, 'MemberExpression') &&
        utils.isId(node.object.object.object, /^(Array)$/) &&
        utils.isId(node.object.object.property, 'prototype')) {
      var type = node.object.object.object.name;
      var method = node.object.property.name;
      var longName = type + '#' + method;
      handler = get(_array, longName);
      if (handler) {
        // move the 1st argument to be the reciever
        var args = utils.clone(node.parent.arguments);
        var thisArg = args.shift();
        node = {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: thisArg,
            property: node.object.property,
            isCallee: true,
          },
          arguments: args,
          parent: node.parent,
        };
        node.parent.arguments = false;
      }
    }

    if (utils.isType(node.object, 'Literal')) {
      var method = node.property.name;
      if (!(utils.isType(node.parent, 'CallExpression') && node === node.parent.callee)) {
        method = '.' + method;
      }
      handler = node.object.regex ? get(_regexp, method) : get(_string, method);
    } else if (utils.isId(node.object, /^(Array|Date|JSON|Math|Object|Promise|console)$/)) {
      var longName = node.object.name + '.' + node.property.name;
      handler = get(_array, longName) || get(_date, longName) || get(_json, longName) || get(_math, longName) || get(_object, longName) || get(_promise, longName) || get(_console, longName);
    } else if (utils.isType(node.property, 'Identifier')) {
      var method = node.property.name;
      if (!(utils.isType(node.parent, 'CallExpression') && node === node.parent.callee)) {
        method = '.' + method;
      }
      // _array should be before _string here so we pick up the correct
      // multitype version of #length and #indexOf
      handler = get(_array, method) || get(_date, method) || get(_function, method) || get(_json, method) || get(_regexp, method) || get(_string, method) || get(_math, method) || get(_number, method);
    } else if (node.callee) {
      handler = get(_global, node.callee.name);
    }

    if (handler) {
      node = handler(node);
      node.scope = scope.create(node);
    }

    return node;
  }

}
