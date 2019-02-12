var utils = require('../utils');

module.exports = {
  'Promise.async': function(node) {
    var args = utils.clone(node.parent.arguments);
    if (args.length === 1) {
      node.parent.arguments = false;
      args[0].suppressParens = true;
      args[0].leadingComments = args[0].leadingComments || [];
      args[0].leadingComments.push({ type: 'Block', value: ' async ' });
      return args[0];
    };
    return node;
  }
};

utils.coreAddHash(module.exports, 'Promise');
