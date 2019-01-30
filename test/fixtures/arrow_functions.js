var something = (a, b = 2, c = 4) => {
  return a * b * c;
}
var something2 = (a, b = 2, c = 4) => a * b * c;

var something3 = () => 5;

var_dump(something3());
