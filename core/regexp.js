var utils = require('../utils');

module.exports = {
  source: function(node) {
    node.object.value = node.object.value.source;
    node.object.raw = JSON.stringify(node.object.value);
    node.object.regex = undefined;
    return node.object;
  },

  test: function(node) {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;
    args[0].suppressParens = true;
    var lit = module.exports.source(node.parent.callee);
    lit.value = '/' + lit.value + '/';
    lit.raw = JSON.stringify(lit.value);
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'preg_match',
      },
      arguments: [ node.parent.callee.object, args[0] ],
    };
  },
};
