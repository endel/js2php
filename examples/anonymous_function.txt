var inline = (function(i){
  return i;
})(5);
var_dump(inline);

var assignment;
assignment = (function() {
  var _results = [1,2,3,4,5];
  return _results;
})();
var_dump(assignment);
