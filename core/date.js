var utils = require('../utils');

function isDateClass(node) {
  return node.object.name == "Date";
}

module.exports = {

  now: function(node) {
    if (isDateClass(node)) {
      var args = utils.clone(node.parent.arguments);
      node.parent.arguments = false;

      return {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'time',
        },
        arguments: []
      };
    } else {
      return node;
    }
  }

}
