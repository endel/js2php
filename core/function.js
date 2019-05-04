var utils = require('../utils');

function apply(node, isCall) {
  var method, arguments = [];

  if (node.object.property) {
    node.object.property.type = "Literal"
    node.object.property.raw = "'"+node.object.property.name+"'";

    arguments.push({
      type: "ArrayExpression",
      elements: [ node.object.object, node.object.property ]
    })
  } else {
    node.object.type = "Literal"
    node.object.raw = "'"+node.object.name+"'";
    arguments.push(node.object);
  }

  // remove first argument, which overrides the this
  node.parent.arguments.shift();

  if (isCall) {
    // .call use call_user_func
    method = "call_user_func";
    arguments = arguments.concat(node.parent.arguments);
  } else {
    // .apply use call_user_func_array
    method = "call_user_func_array";
    if (node.parent.arguments[0]) {
      arguments.push(node.parent.arguments[0]);
    } else {
      arguments.push({
        type: "ArrayExpression",
        elements: [],
      });
    }
  }

  node.parent.arguments = false;

  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: method,
    },
    arguments: arguments
  };
}

module.exports = {

  call: function(node) {
    return apply(node, true);
  },

  apply: function(node, isCall) {
    return apply(node, false)
  },

};

utils.coreAddHash(module.exports, 'Function');
