var utils = require('../utils'),
    scope = require('../scope');
    string = require('./string');

module.exports = {
  'Array.isArray': function(node) {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'is_array',
      },
      arguments: args,
    };
  },

  unshift: function(node) {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;
    if (args.length === 1) { args[0].suppressParens = true; }
    args.unshift(node.parent.callee.object);
    scope.get(node).getDefinition(node.parent.callee.object);

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'array_unshift',
      },
      arguments: args,
    };
  },

  shift: function(node) {
    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'array_shift',
      },
      arguments: [ node.parent.callee.object ]
    };
  },

  reverse: function(node) {
    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'array_reverse',
      },
      arguments: [ node.parent.callee.object ]
    };
  },

  push: function(node) {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);
    if (args.length === 1) { args[0].suppressParens = true; }
    args.unshift(node.parent.callee.object);

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'array_push',
      },
      arguments: args,
    };
  },

  pop: function(node) {
    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'array_pop',
      },
      arguments: [ node.parent.callee.object ]
    };
  },

  join: function(node) {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);
    args[0].suppressParens = true;

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'implode',
      },
      arguments: [ args[0], node.parent.callee.object ]
    };
  },

  map: function(node) {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);
    args[0].suppressParens = true;

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'array_map',
      },
      arguments: [ node.parent.callee.object, args[0] ]
    };
  },

  reduce: function(node) {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);
    if (args.length === 1) {
      args[0].suppressParens = true;
    }
    args.unshift(node.parent.callee.object);

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'array_reduce',
      },
      arguments: args,
    };
  },

  slice: function(node) {
    var args = utils.clone(node.parent.arguments);
    if (node.parent.arguments.length > 1) {
      // Second argument to array_slice is very different from Array#slice
      // unless it is negative.
      if (args[1].type === 'UnaryExpression' && args[1].operator==='-' &&
          args[1].argument.type==='Literal') {
        /* this is okay */
      } else {
        args[1].trailingComments = [{ type: 'Block', value: 'CHECK THIS'}];
      }
    } else if (node.parent.arguments.length === 0) {
        args.unshift({ type: 'Literal', value: 0, raw: '0' });
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
        name: 'array_slice',
      },
      arguments: args
    };
  },

  splice: function(node) {
    var args = utils.clone(node.parent.arguments);
    args.unshift(node.parent.callee.object);
    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'array_splice',
      },
      arguments: args
    };
  },

  indexOf: function(node) {
    var method = "array_search",
        args = utils.clone(node.parent.arguments);

    node.parent.arguments = false;
    scope.get(node).getDefinition(node.parent.callee.object);
    args[0].suppressParens = true;

    var targetDefinition = scope.get(node).getDefinition(node.parent.callee.object);
    if (utils.isString(node.parent.callee.object) || (targetDefinition && targetDefinition.dataType == "String")) {
      method = "strpos";
      args = [ node.parent.callee.object, args[0] ];

    } else {
      args = [ args[0], node.parent.callee.object ];
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

  '.length': function(node) {
    var method,
        object = (node.parent.callee && node.parent.callee.object) || node.object,
        isString = utils.isString(object);

    var targetDefinition = scope.get(node).getDefinition(object);

    if (!isString && targetDefinition) {
      if (utils.isId(targetDefinition, "string")) {
        isString = true;
      } else if (targetDefinition.dataType == "String") {
        isString = true;
      } else if(targetDefinition.type == "Identifier" && targetDefinition.parent.type == "AssignmentExpression") {
        isString = utils.isString(targetDefinition.parent.right);
      }
    }

    if (isString || (targetDefinition && targetDefinition.dataType == "String")) {
      method = "strlen";
    } else {
      method = "count";
    }

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: method,
      },
      arguments: [ object ]
    };
  },

};

utils.coreAddHash(module.exports, 'Array');
