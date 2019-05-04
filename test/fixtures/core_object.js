var a = Object.create(null);
a["foo"] = "bar";
var_dump(a);

// Avoid a crash when looking up a method named hasOwnProperty
var b = {};
var_dump(b.hasOwnProperty('foo'));
