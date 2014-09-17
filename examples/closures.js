var closure = function(a) {
  var c = 1;
  return function(b) {
    return a + b + c;
  }
}

calling = closure(5);
var_dump(calling(4) == 10);
