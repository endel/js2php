var utils = require('../utils'),
    scope = require('../scope');
    string = require('./string');

module.exports = {

  unshift: function(node) {
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'array_unshift',
      },
      arguments: [node.parent.callee.object, args[0]]
    };
  },

  shift: function(node) {
    node.parent.arguments = false;
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
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'array_push',
      },
      arguments: [ node.parent.callee.object, args[0] ]
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
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'join',
      },
      arguments: [ args[0], node.parent.callee.object ]
    };
  },

  splice: function(node) {
    var args = utils.clone(node.parent.arguments);
    args.unshift(node.parent.callee.object);

    node.parent.arguments = false;

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

  length: function(node) {
    var method,
        object = (node.parent.callee && node.parent.callee.object) || node.object,
        isString = (object.type=='Literal' && object.raw.match(/^['|"]/));

    var targetDefinition = scope.get(node).getDefinition(object);
    if (utils.isString(object) || (targetDefinition && targetDefinition.dataType == "String")) {
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

}
