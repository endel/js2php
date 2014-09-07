module.exports = {

  //
  // array functions
  //

  unshift: function(node) {
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'array_unshift',
      },
      arguments: [node.parent.callee.object, node.parent.arguments[0]]
    };
  },

  shift: function(node) {
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
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'array_push',
      },
      arguments: [ node.parent.callee.object, node.parent.arguments[0] ]
    };
  },

  pop: function(node) {
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
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'join',
      },
      arguments: [ node.parent.arguments[0], node.parent.callee.object ]
    };
  },

  splice: function(node) {
    node.parent.arguments.unshift(node.parent.callee.object);
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'array_splice',
      },
      arguments: node.parent.arguments
    };
  },

  indexOf: function(node) {
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'array_search',
      },
      arguments: [ node.parent.arguments[0], node.parent.callee.object ]
    };
  },

  length: function(node) {
    var object = (node.parent.callee && node.parent.callee.object) || node.object,
        // TODO: identify data-types from "Identifier" types
        isString = (object.type=='Literal' && object.raw.match(/^['|"]/)),
        method = isString ? "strlen" : "count";

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: method,
      },
      arguments: [ object ]
    };
  },

  //
  // string functions
  //

  trim: function(node) {
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
    node.parent.arguments.unshift(node.parent.callee.object);
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'str_split',
      },
      arguments: node.parent.arguments
    };
  },

  substr: function(node) {
    node.parent.arguments.unshift(node.parent.callee.object);

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'substr',
      },
      arguments: node.parent.arguments
    };
  },

  match: function(node) {
    node.parent.arguments[0].raw = "'" + node.parent.arguments[0].raw + "'";
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'preg_match',
      },
      arguments: [ node.parent.arguments[0], node.parent.callee.object ]
    };
  },


}
