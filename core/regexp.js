var utils = require('../utils');

module.exports = {
  exec: function(node) {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;
    args[0].suppressParens = true;
    var regexpData = node.parent.callee.object.raw
        .match(/^\/((?:[^\/]|\\.)+)\/([gimy])?$/);
    var flags = (regexpData && regexpData[2]) || "";
    var isGroup = flags.indexOf('g') >= 0;
    var lit = module.exports['.source'](node.parent.callee);
    lit.value = '/' + lit.value + '/' + flags.replace(/g/g, "");
    lit.raw = JSON.stringify(lit.value);
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: isGroup ? 'preg_match_all' : 'preg_match',
      },
      arguments: [ node.parent.callee.object, args[0], {
        type: 'Identifier',
        name: 'FIXME',
      }],
      leadingComments: [{ type: 'Block', value: 'RegExp#exec' }],
    };
  },

  '.source': function(node) {
    node.object.value = node.object.value.source;
    node.object.raw = JSON.stringify(node.object.value);
    node.object.regex = undefined;
    return node.object;
  },

  test: function(node) {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;
    args[0].suppressParens = true;
    var lit = module.exports['.source'](node.parent.callee);
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

utils.coreAddHash(module.exports, 'RegExp');
