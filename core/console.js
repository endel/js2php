var utils = require('../utils');

module.exports = {
  console_assert: function(node) {
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
