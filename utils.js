module.exports = {
  capitaliseFirstLetter: function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  clone: function(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}
