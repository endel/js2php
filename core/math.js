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
  if (isMathClass(node)) {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;
    return { type: 'CallExpression', callee: { type: 'Identifier', name: name, }, arguments: args };
  } else {
    return node;
  }
}

module.exports = {

  // constants
  E: function(node) { return constant(node, 'M_E'); },
  LN2: function(node) { return constant(node, 'M_LN2'); },
  LN10: function(node) { return constant(node, 'M_LN10'); },
  LOG2E: function(node) { return constant(node, 'M_LOG2E'); },
  LOG10E: function(node) { return constant(node, 'M_LOG10E'); },
  PI: function(node) { return constant(node, 'M_PI'); },
  SQRT2: function(node) { return constant(node, 'M_SQRT2'); },
  SQRT1_2: function(node) { return constant(node, 'M_SQRT1_2'); },

  // methods
  abs: function(node) { return method(node, 'abs'); },
  acos: function(node) { return method(node, 'acos'); },
  acosh: function(node) { return method(node, 'acosh'); },
  asin: function(node) { return method(node, 'asin'); },
  asinh: function(node) { return method(node, 'asinh'); },
  atan: function(node) { return method(node, 'atan'); },
  atanh: function(node) { return method(node, 'atanh'); },
  atan2: function(node) { return method(node, 'atan2'); },
  cbrt: function(node) { return method(node, 'cbrt'); },
  ceil: function(node) { return method(node, 'ceil'); },
  clz32: function(node) { return method(node, 'clz32'); },
  cos: function(node) { return method(node, 'cos'); },
  cosh: function(node) { return method(node, 'cosh'); },
  exp: function(node) { return method(node, 'exp'); },
  expm1: function(node) { return method(node, 'expm1'); },
  floor: function(node) { return method(node, 'floor'); },
  // fround: function(node) { return method(node, 'fround'); },
  hypot: function(node) { return method(node, 'hypot'); },
  // imul: function(node) { return method(node, 'imul'); },
  log: function(node) { return method(node, 'log'); },
  log1p: function(node) { return method(node, 'log1p'); },
  log10: function(node) { return method(node, 'log10'); },
  // log2: function(node) { return method(node, 'log2'); },
  max: function(node) { return method(node, 'max'); },
  min: function(node) { return method(node, 'min'); },
  pow: function(node) { return method(node, 'pow'); },
  random: function(node) { return method(node, 'rand'); },
  round: function(node) { return method(node, 'round'); },
  // sign: function(node) { return method(node, 'sign'); },
  sin: function(node) { return method(node, 'sin'); },
  sinh: function(node) { return method(node, 'sinh'); },
  sqrt: function(node) { return method(node, 'sqrt'); },
  tan: function(node) { return method(node, 'tan'); },
  tanh: function(node) { return method(node, 'tanh'); },
  // trunc: function(node) { return method(node, 'trunc'); },


}
