module.exports = {

  //
  // string methods
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
