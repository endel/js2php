
function something(x, y = "something", z = 5) {
  var_dump(x, y, z);
}

function sum(a, b) {
  return a + b;
}

function hello(a, b) {
  return "hello!";
}

let total = 0
function add(x) {
  total += x
}

var_dump(hello.apply(hello, [5, 6]))
var_dump(hello(5, 6))
add(1);
add(2);
var_dump($total);
