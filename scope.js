function Scope() {
  this.getters = [];
  this.setters = [];

  this.register = function(node) {
  }

}

module.exports = {

  get: function(node, kind) {
    if (node.scope && node.scope[kind]) {
      return node.scope[kind];
    } else {
      return (!node.parent) ? {} : this.get(node.parent);
    }
  },

  create: function(node, kind) {
    node.scope = {};
    return node.scope[kind] = new Scope();
  }

}
