var utils = require('../utils');

function isJSONClass(node) {
  return node.object.name == "JSON";
}

module.exports = {

  'JSON.stringify': function(node) {
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
  },

  'JSON.parse': function(node) {
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
  },

};

utils.coreAddHash(module.exports, 'JSON');
