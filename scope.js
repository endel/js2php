function Scope() {

  this.register = function(node) {
  }

}

module.exports = {
  get: function(node) {
    if (!node.scope) {
      return (!node.parent) ? null : this.get(node.parent);
    } else {
      return node.scope;
    }
  },

  create: function(node) {
    node.scope = new Scope();
  }

}
