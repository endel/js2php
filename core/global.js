var utils = require('../utils');

module.exports = {

  parseInt: function(node) {
      var newNode = utils.clone(node);
      newNode.callee.name = "intval";
      return newNode;
  },

  parseFloat: function(node) {
      var newNode = utils.clone(node);
      newNode.callee.name = "floatval";
      return newNode;
  }

};
