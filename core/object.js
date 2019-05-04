var utils = require('../utils');

module.exports = {
  'Object.create': function(node) {
    var args = utils.clone(node.parent.arguments);
    if (args.length === 1 && args[0].type === 'Literal' && args[0].value === null) {
      node.parent.arguments = false;
      return {
        type: 'ObjectExpression',
        properties: [],
      };
    };
    return node;
  }
};

utils.coreAddHash(module.exports, 'Object');
