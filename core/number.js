var utils = require('../utils');

function isNumberClass(node) {
  return node.object.name == "Number";
}

function constant(node, name) {
  if (isNumberClass(node)) {
    return { type: 'Identifier', name: name, static: true };
  } else {
    return node;
  }
}

function method(node, name) {
  if (isNumberClass(node)) {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;
    return { type: 'CallExpression', callee: { type: 'Identifier', name: name, }, arguments: args };
  } else {
    return node;
  }
}

module.exports = {

  isInteger: function(node) { return method(node, 'is_int'); },
  isFinite: function(node) { return method(node, 'is_finite'); },

};

utils.coreAddHash(module.exports, 'Number');
