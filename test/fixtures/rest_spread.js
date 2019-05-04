var x = (...args) => args.length;
var y = (z) => x(...z);

var_dump(x(1, 2, 3, 4));
var_dump(y([1, 2, 3]));
