var one = "Hello".match(/llo/);
var_dump(one);

var two = "Hello".match(/llo/g);
var_dump(two);

var splitted = "one, two, three".split(",");
var_dump(splitted);

var splitted = "one, two, three".split(/,/);
var_dump(splitted);

var g_splitted = "one, two, three".split(/,/g);
var_dump(g_splitted);

var_dump("hey".replace("y", "llo"));
var_dump("hey".replace(/y/, "llo"));
var_dump("hey hey hey".replace(/y/, "llo"));
var_dump("hey hey hey".replace(/y/g, "llo"));
