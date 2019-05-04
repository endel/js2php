var utils = require('../utils');

module.exports = {
  'console.assert': function(node) {
    return {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: 'Assert',
      },
      property: {
        type: 'Identifier',
        name: 'invariant',
      }
    };
  }
};

utils.coreAddHash(module.exports, 'console');
