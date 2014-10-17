module.exports = {
  capitaliseFirstLetter: function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
    return node.type == "Literal" && node.raw.match(/^['|"]/);
  },

  isRegExp: function(node) {
    var value = node.raw;

    if (value.match(/^['"].+['"]$/)) {
      value = value.substr(1, node.raw.length-2);
    }

    var isRegExp = value.match(/^\/[^\/]+\/[gimy]?$/);

    if (isRegExp) {
      node.raw.value = "'" + value + "'";
      node.dataType = 'RegExp';
    }

    return isRegExp;
  }
}
