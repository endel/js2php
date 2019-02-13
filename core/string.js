var utils = require('../utils'),
    scope = require('../scope');

module.exports = {

  //
  // string methods
  //
  indexOf: function(node) {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);
    if (args.length === 1) { args[0].suppressParens = true; }
    args.unshift(node.parent.callee.object);

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'strpos',
      },
      arguments: args
    };
  },

  '.length': function(node) {
    var object = (node.parent.callee && node.parent.callee.object) || node.object;
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'strlen',
      },
      arguments: [object],
    };
  },

  replace: function(node) {
    var method = "str_replace";
    var args = utils.clone(node.parent.arguments);
    args.push(node.parent.callee.object)
    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);

    if(args[0].type === 'Literal'){
      var regexpData = args[0].raw.match(/^\/((?:[^\/]|\\.)+)\/([gimy]+)?$/),
          regex = regexpData && regexpData[1],
          flags = regexpData && regexpData[2] || "",
          isGroup = flags.indexOf('g') >= 0;

      // check for RegExp for preg_replace
      if (regexpData) {
        method = "preg_replace";
        args[0].value = "/" + regex + "/" + flags.replace("g", "");
        args[0].raw = utils.stringify(args[0].value);
        args[0].type = "Literal";
        args[0].regex = false;

        // fill '$limit' param with only 1 replacement
        // http://php.net/manual/en/function.preg-replace.php
        if (!isGroup) {
          args.push({ type: 'Literal', value: 1, raw: '1' });
        }
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

  slice: function(node) {
    var args = utils.clone(node.parent.arguments);
    if (node.parent.arguments.length > 1) {
      // Second argument to substr is very different from String#slice
      // unless it is negative.
      if (args[1].type === 'UnaryExpression' && args[1].operator==='-' &&
          args[1].argument.type==='Literal') {
        /* this is okay */
      } else {
        args[1].trailingComments = [{ type: 'Block', value: 'CHECK THIS'}];
      }
    } else {
      args[0].suppressParens = true;
    }
    args.unshift(node.parent.callee.object);
    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'substr',
      },
      arguments: args
    };
  },

  trim: function(node) {
    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);

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
    scope.get(node).getDefinition(node.parent.callee.object);

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
    scope.get(node).getDefinition(node.parent.callee.object);

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
    scope.get(node).getDefinition(node.parent.callee.object);

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
    scope.get(node).getDefinition(node.parent.callee.object);

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
    var method = "explode";
    var args = utils.clone(node.parent.arguments);
    args.push(node.parent.callee.object);
    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);

    var regexpData = args[0].type==='Literal' &&
        args[0].raw.match(/^\/((?:[^\/]|\\.)+)\/([gimy]+)?$/),
        regex = regexpData && regexpData[1],
        flags = regexpData && regexpData[2] || "";

    // check for RegExp for preg_replace
    if (regexpData) {
      method = "preg_split";
      args[0].value = "/" + regex + "/" + flags.replace("g", "");
      args[0].raw = utils.stringify(args[0].value);
      args[0].type = "Literal";
      args[0].regex = false;
      if (args.length === 2) {
        args[0].suppressParens = true;
      }
    }
    // If splitting with a blank delimiter, use str_split.
    else if (args[0].value === '') {
      method = "str_split";
      args = [args[1]];
    } else if (args.length == 2) {
      args[0].suppressParens = true;
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
    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);
    if (args.length === 1) { args[0].suppressParens = true; }
    args.unshift(node.parent.callee.object);

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
    args[0].suppressParens = true;
    args.push(node.parent.callee.object);

    if(args[0].type === 'Literal') {

      var regexpData = args[0].regex &&
          args[0].raw.match(/^\/((?:[^\/]|\\.)+)\/([gimy]+)?$/),
          pattern = regexpData && regexpData[1],
          flags = regexpData && regexpData[2] || "",
          isGroup = flags.indexOf('g') >= 0;

      // String#match can be called with a raw string as well.
      if ((!args[0].regex) && typeof args[0].value === 'string') {
        var r = new RegExp(args[0].value);
        pattern = r.source;
        flags = '';
        isGroup = false;
      }
      // remove unsupported /g from regexp, to use preg_match_all
      if (isGroup) { flags = flags.replace(/g/g, ''); }
      args[0].value = '/' + pattern + '/' + flags;
      args[0].raw = utils.stringify(args[0].value);
      args[0].type = "Literal";
      args[0].regex = undefined;
    }

    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);
    if (isGroup) {
      // results come back in this out-argument
      args.push({ type: 'Identifier', name: 'FIXME' });
    }

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: (isGroup) ? 'preg_match_all' : 'preg_match',
      },
      arguments: args
    };

  },

};

utils.coreAddHash(module.exports, 'String');
