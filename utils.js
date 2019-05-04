module.exports = {
  //
  // classize:
  //
  // Example
  //   input: 'some.module.name'
  //   output: '\Some\Module\Name'
  //
  classize: function (string) {
    var modules = string.split(".");
    if (modules.length == 1) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      var m = [];
      for (var i=0; i<modules.length; i++) {
        m.push(this.classize(modules[i]));
      }
      return m.join("\\");
    }
  },

  stringify: function(string, forceDoubleQuote) {
    if (/^[ -&\(-~]*$/.test(string) && !forceDoubleQuote) {
      /* can use an efficient single-quoted string */
      return "'" + string.replace(/'|(?:\\(?=[\\']|$))/g, '\\$&') + "'";
    }
    return JSON.stringify(string).replace(/\$/g, '\\$'); // double-quoted string
  },

  clone: function(obj) {
    var parent = null, response = null;

    // prevent circular loop when cloning the obj.
    if (obj.parent) {
      parent = obj.parent;
      delete obj.parent;
    }

    response = JSON.parse(JSON.stringify(obj));

    // keep original parent
    if (parent) { obj.parent = parent; }

    return response;
  },

  isString: function(node) {
    return (node.type == "Literal" && node.raw.match(/^['|"]/)) ||
      node.dataType === 'String';
  },

  isRegExp: function(node) {
    var value = node.raw;

    if (value.match(/^['"].+['"]$/)) {
      value = value.substr(1, node.raw.length-2);
    }

    var isRegExp = value.match(/^\/(?:[^\/]|\\.)+\/[gimy]+?$/);

    if (isRegExp) {
      node.raw.value = "'" + value + "'";
      node.dataType = 'RegExp';
    }

    return isRegExp;
  },

  isType: function(node, type) {
    return node &&
      (typeof(type)==='string' ? (type===node.type) : type.test(node.type));
  },

  isId: function(node, id) {
    return module.exports.isType(node, 'Identifier') &&
      (typeof(id)==='string' ? (id===node.name) : id.test(node.name));
  },

  // utility function for core library definitions
  coreAddHash: function(exports, className) {
    Object.keys(exports).forEach(function(name) {
      if (/[#.]/.test(name)) { return; }
      exports[className + '#' + name] = exports[name];
    });
  },
}
