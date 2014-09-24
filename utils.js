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
  }
}
