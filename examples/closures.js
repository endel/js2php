var closure = function(a) {
  var c = 1;
  return function(b) {
    return a + b + c;
  }
}

c = closure(5);
var_dump(c(4) == 10);
