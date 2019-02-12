var utils = require('../utils');

module.exports = {

  'Date.now': function(node) {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'time',
      },
      arguments: []
    };
  }

};

utils.coreAddHash(module.exports, 'Date');
