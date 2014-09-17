function Scope(root, parent) {
  this.node = root;
  this.parent = parent;

  this.definitions = {};

  this.getters = [];
  this.setters = [];

  this.getDefinition = function(node) {
    return this.definitions[ node.name ];
  }

  this.register = function(node) {
    var name = null;

    if (node.type == 'VariableDeclarator') {
      name = node.id.name;

    } else if (node.type == 'Identifier') {
      name = node.name;

    } else if (node.type == 'MethodDefinition') {
    }

    this.definitions[name] = node;
  }

}

module.exports = {
  KIND_ROOT : 0,
  KIND_NODE : 1,

  get: function(node, kind) {
    if (node.scope) { //  && node.scope[kind]
      return node.scope; // [kind];
    } else {
      return this.get(node.parent);
    }
  },

  create: function(node, kind) {
    return node.scope = new Scope(node, node.parent && this.get(node.parent));
  }

}
