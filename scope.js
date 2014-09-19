function Scope(root, parent) {
  this.node = root;
  this.parent = parent;

  this.definitions = {};
  this.using = [];

  this.getters = [];
  this.setters = [];

  this.getDefinition = function(node) {
    var value = this.definitions[ node.name ];

    if (!value && this.parent) {
      value = this.parent.getDefinition(node);
      if (value) {
        this.using.push(node.name);
      }
    }

    return value;
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

  get: function(node) {
    if (node.scope) {
      return node.scope;
    } else {
      // TODO: 'node.parent' should never be equals to 'node'
      return (node.parent != node) ? this.get(node.parent) : new Scope();
    }
  },

  create: function(node) {
    return node.scope = new Scope(node, node.parent && this.get(node.parent));
  }

}
