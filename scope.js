var utils = require('./utils');

var tmpCounter = 0;

function Scope(root, parent) {
  this.node = root;
  this.parent = parent;

  this.definitions = {};
  this.using = [];

  this.getters = [];
  this.setters = [];

  this.getDefinition = function(node, suppressUsing) {
    var value = this.definitions[ node.name ];

    if (!value && this.parent) {
      value = this.parent.getDefinition(node);
      if (value && (!suppressUsing) && this.using.indexOf(node.name) === -1) {
        this.using.push(node.name);
      }
    }

    return value;
  };

  this.getTmpName = function() {
    while (true) {
      var name = `temp${tmpCounter++}`;
      if (this.getDefinition({ name }, true) === undefined) {
        return name;
      }
    }
  };

  this.register = function(node) {
    var name = null;

    if (node.type == 'VariableDeclarator') {
      var dataType = null;
      name = node.id.name;

      if (node.init && utils.isString(node.init)) {
        dataType = "String";
      }

      node.dataType = dataType;

    } else if (node.type == 'Identifier') {
      name = node.name;
    } else if (node.type === 'MemberExpression'&& node.object.type === 'ThisExpression' && node.property.type === 'Identifier') {
      name = node.property.name
    } else if (node.type == 'MethodDefinition') {
      if (node.kind == "get") {
        var getter = utils.clone(node);
        getter.kind = null;
        this.getters.push(getter);
      } else if (node.kind == "set") {
        var setter = utils.clone(node);
        setter.kind = null;
        this.setters.push(setter);
      }

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
      return this.get(node.parent);
    }
  },

  create: function(node) {
    return node.scope = new Scope(node, node.parent && this.get(node.parent));
  }

}
