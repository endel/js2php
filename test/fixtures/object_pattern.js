var x = { foo: 'foo', bar: 42 };
var { foo, bar } = x;
var y = 'not foo';
({ foo: y } = x);
var_dump(`${foo} ${bar} ${y}`);
