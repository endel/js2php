d = 10;
var closure = function(a) {
  var c = 1;
  return function(b) {
    return a + b + c + d;
  }
}

calling = closure(5);
var_dump(calling(4) == 20);
