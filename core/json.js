var utils = require('../utils');

function isJSONClass(node) {
  return node.object.name == "JSON";
}

module.exports = {

  stringify: function(node) {
    if (isJSONClass(node)) {
      var args = utils.clone(node.parent.arguments);
      node.parent.arguments = false;

      return {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'json_encode',
        },
        arguments: args
      };
    } else {
      return node;
    }
  },

  parse: function(node) {
    if (isJSONClass(node)) {
      var args = utils.clone(node.parent.arguments);
      node.parent.arguments = false;

      return {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'json_decode',
        },
        arguments: args,
        forceSkip: true
      };
    } else {
      return node;
    }
  }

}
