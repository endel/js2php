var utils = require('../utils');

function isMathClass(node) {
  return node.object.name == "Math";
}

function constant(node, name) {
  if (isMathClass(node)) {
    return { type: 'Identifier', name: name, static: true };
  } else {
    return node;
  }
}

function method(node, name) {
  if (isMathClass(node) && node.parent.type === 'CallExpression') {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;
    return { type: 'CallExpression', callee: { type: 'Identifier', name: name, }, arguments: args };
  } else {
    return node;
  }
}

module.exports = {

  // constants
  'Math.E': function(node) { return constant(node, 'M_E'); },
  'Math.LN2': function(node) { return constant(node, 'M_LN2'); },
  'Math.LN10': function(node) { return constant(node, 'M_LN10'); },
  'Math.LOG2E': function(node) { return constant(node, 'M_LOG2E'); },
  'Math.LOG10E': function(node) { return constant(node, 'M_LOG10E'); },
  'Math.PI': function(node) { return constant(node, 'M_PI'); },
  'Math.SQRT2': function(node) { return constant(node, 'M_SQRT2'); },
  'Math.SQRT1_2': function(node) { return constant(node, 'M_SQRT1_2'); },

  // methods
  'Math.abs': function(node) { return method(node, 'abs'); },
  'Math.acos': function(node) { return method(node, 'acos'); },
  'Math.acosh': function(node) { return method(node, 'acosh'); },
  'Math.asin': function(node) { return method(node, 'asin'); },
  'Math.asinh': function(node) { return method(node, 'asinh'); },
  'Math.atan': function(node) { return method(node, 'atan'); },
  'Math.atanh': function(node) { return method(node, 'atanh'); },
  'Math.atan2': function(node) { return method(node, 'atan2'); },
  'Math.cbrt': function(node) { return method(node, 'cbrt'); },
  'Math.ceil': function(node) { return method(node, 'ceil'); },
  'Math.clz32': function(node) { return method(node, 'clz32'); },
  'Math.cos': function(node) { return method(node, 'cos'); },
  'Math.cosh': function(node) { return method(node, 'cosh'); },
  'Math.exp': function(node) { return method(node, 'exp'); },
  'Math.expm1': function(node) { return method(node, 'expm1'); },
  'Math.floor': function(node) { return method(node, 'floor'); },
  // fround: function(node) { return method(node, 'fround'); },
  'Math.hypot': function(node) { return method(node, 'hypot'); },
  // imul: function(node) { return method(node, 'imul'); },
  'Math.log': function(node) { return method(node, 'log'); },
  'Math.log1p': function(node) { return method(node, 'log1p'); },
  'Math.log10': function(node) { return method(node, 'log10'); },
  // log2: function(node) { return method(node, 'log2'); },
  'Math.max': function(node) { return method(node, 'max'); },
  'Math.min': function(node) { return method(node, 'min'); },
  'Math.pow': function(node) { return method(node, 'pow'); },
  'Math.random': function(node) { return method(node, 'rand'); },
  'Math.round': function(node) { return method(node, 'round'); },
  // sign: function(node) { return method(node, 'sign'); },
  'Math.sin': function(node) { return method(node, 'sin'); },
  'Math.sinh': function(node) { return method(node, 'sinh'); },
  'Math.sqrt': function(node) { return method(node, 'sqrt'); },
  'Math.tan': function(node) { return method(node, 'tan'); },
  'Math.tanh': function(node) { return method(node, 'tanh'); },
  // trunc: function(node) { return method(node, 'trunc'); },


};

utils.coreAddHash(module.exports, 'Math');
