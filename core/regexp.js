var utils = require('../utils'),
    scope = require('../scope');

module.exports = {
  exec: function(node) {
    var args = utils.clone(node.parent.arguments);
    if (utils.isType(node.parent.callee.object, "Literal") &&
        node.parent.callee.object.regex) {
      node.parent.arguments = false;
      args[0].suppressParens = true;
      var regexpData = node.parent.callee.object.raw
          .match(/^\/((?:[^\/]|\\.)+)\/([gimy]+)?$/);
      var pattern = (regexpData && regexpData[1]);
      var flags = (regexpData && regexpData[2]) || "";
      var isGroup = flags.indexOf('g') >= 0;
      var lit = node.parent.callee.object;
      if (isGroup) { flags = flags.replace(/g/g, ''); }
      lit.value = '/' + pattern + '/' + flags;
      lit.raw = utils.stringify(lit.value);
      lit.regex = undefined;
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
    } else {
      return node;
    }
  },

  '.source': function(node) {
    if (utils.isType(node.object, "Literal") && node.object.regex) {
      node.object.value = node.object.regex.pattern;
      node.object.raw = utils.stringify(node.object.value);
      node.object.regex = undefined;
      return node.object;
    } else {
      return node;
    }
  },

  test: function(node) {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);
    args[0].suppressParens = true;
    if (utils.isType(node.parent.callee.object, "Literal") &&
        node.parent.callee.object.regex) {
      var lit = node.parent.callee.object;
      if (lit.value.source) {
        lit.value = '/' + lit.value.source + '/';
      } else {
        lit.value = lit.raw;
      }
      lit.raw = utils.stringify(lit.value);
      lit.regex = undefined;
      return {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'preg_match',
        },
        arguments: [ node.parent.callee.object, args[0] ],
      };
    } else {
      return {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'preg_match',
        },
        arguments: [ node.parent.callee.object, args[0] ],
      };
    }
  },
};

utils.coreAddHash(module.exports, 'RegExp');
