var utils = require('../utils');

module.exports = {

  //
  // string methods
  //

  replace: function(node) {
    var method = "str_replace";
    var args = utils.clone(node.parent.arguments);
    args.push(node.parent.callee.object)

    node.parent.arguments = false;

    var regexpData = args[0].raw.match(/^\/([^\/]+)\/([gimy])?$/),
        regex = regexpData && regexpData[1],
        flags = regexpData && regexpData[2] || "",
        isGroup = flags.indexOf('g') >= 0;

    // check for RegExp for preg_replace
    if (regexpData) {
      method = "preg_replace";
      args[0].raw = "'/" + regex + "/" + flags.replace("g", "") + "'";
      args[0].type = "Literal";

      // fill '$limit' param with only 1 replacement
      // http://php.net/manual/en/function.preg-replace.php
      if (!isGroup) {
        args.push({ type: 'Literal', value: 1, raw: '1' });
      }
    }

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: method,
      },
      arguments: args
    };
  },

  trim: function(node) {
    node.parent.arguments = false;

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'trim',
      },
      arguments: [ node.parent.callee.object ]
    };
  },

  trimRight: function(node) {
    node.parent.arguments = false;

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'rtrim',
      },
      arguments: [ node.parent.callee.object ]
    };
  },

  trimLeft: function(node) {
    node.parent.arguments = false;

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'ltrim',
      },
      arguments: [ node.parent.callee.object ]
    };
  },

  toUpperCase: function(node) {
    node.parent.arguments = false;

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'strtoupper',
      },
      arguments: [ node.parent.callee.object ]
    };
  },

  toLowerCase: function(node) {
    node.parent.arguments = false;

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'strtolower',
      },
      arguments: [ node.parent.callee.object ]
    };
  },

  split: function(node) {
    var method = "split";
    var args = utils.clone(node.parent.arguments);
    args.push(node.parent.callee.object);

    node.parent.arguments = false;

    var regexpData = args[0].raw.match(/^\/([^\/]+)\/([gimy])?$/),
        regex = regexpData && regexpData[1],
        flags = regexpData && regexpData[2] || "";

    // check for RegExp for preg_replace
    if (regexpData) {
      method = "preg_split";
      args[0].raw = "'/" + regex + "/" + flags.replace("g", "") + "'";
      args[0].type = "Literal";
    }

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: method,
      },
      arguments: args
    };
  },

  substr: function(node) {
    var args = utils.clone(node.parent.arguments);
    args.unshift(node.parent.callee.object);

    node.parent.arguments = false;

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'substr',
      },
      arguments: args
    };
  },

  match: function(node) {
    var args = utils.clone(node.parent.arguments);
    args.push(node.parent.callee.object);

    var regexpData = args[0].raw.match(/^\/([^\/]+)\/([gimy])?$/),
        regex = regexpData && regexpData[1],
        flags = regexpData && regexpData[2] || "",
        isGroup = flags.indexOf('g') >= 0;

    // remove unsupported /g from regexp, to use preg_match_all
    if (isGroup) { flags = flags.replace("g", ""); }
    regex = "/" + regex + "/" + flags;

    args[0].raw = "'" + regex + "'";
    args[0].type = "Literal";

    node.parent.arguments = false;

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: (isGroup) ? 'preg_match_all' : 'preg_match',
      },
      arguments: args
    };
  },

}
