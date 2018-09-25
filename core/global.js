var utils = require('../utils');
var scope = require('../scope');

module.exports = {

  parseInt: function(node) {
      var newNode = utils.clone(node);
      newNode.callee.name = "intval";
      newNode.scope = scope.create(node);
      return newNode;
  },

  parseFloat: function(node) {
      var newNode = utils.clone(node);
      newNode.callee.name = "floatval";
      newNode.scope = scope.create(node);
      return newNode;
  }

}
