module.exports = {

  //
  // array methods
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


  //
  // function methods
  //
  call: function(node) {
    return this.apply(node, true);
  },

  apply: function(node, isCall) {
    var method, arguments = [];

    if (node.object.property) {
      node.object.property.type = "Literal"
      node.object.property.raw = "'"+node.object.property.name+"'";

      arguments.push({
        type: "ArrayExpression",
        elements: [ node.object.object, node.object.property ]
      })
    } else {
      node.object.type = "Literal"
      node.object.raw = "'"+node.object.name+"'";
      arguments.push(node.object);
    }

    // remove first argument, which overrides the this
    node.parent.arguments.shift();

    if (isCall) {
      // .call use call_user_func
      method = "call_user_func";
      arguments = arguments.concat(node.parent.arguments);
    } else {
      // .apply use call_user_func_array
      method = "call_user_func_array";
      arguments.push({
        type: "ArrayExpression",
        elements: (node.parent.arguments[0] || {elements:[]}).elements
      });
    }

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: method,
      },
      arguments: arguments
    };
  },

}
