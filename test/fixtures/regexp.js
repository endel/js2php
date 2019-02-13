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

var string = 'hello';
var regex = 'ello';
var nonliteral = string.match(regex);

var_dump(/abc\n[/]/.test('def'));
var_dump(/[\n]/.source.slice(1,-1));

var_dump("./a/b/c".replace(/\.\//, ''));

var matches = /[abc]/gi.exec("LA la black sheep");

var firstA = unknownValue();
if (firstA && /^#/.test(firstA.getAttribute('href'))) {
    var_dump("whoo");
}

// Tricky escape cases.
var x = /abc\n'"\/\\/i.source; // should be "abc\\n'\"\\/\\\\"
var y = /abc\n'"\/\\/i.test("ABC\n'\"/\\"); // should be true
// This only returns one match, but it uses the lastIndex property:
var z1 = /abc\n'"\/\\/ig.exec("abc\n'\"/\\xyzABC\n'\"/\\");
var z2 = "Qabc\n'\"/\\xyzABC\n'\"/\\Q".split(/abc\n'"\/\\/ig);
// z2 should be [ 'Q', 'xyz', 'Q' ]
var z3 = "Qabc\n'\"/\\xyzABC\n'\"/\\Q".match(/abc\n'"\/\\/ig);
// z3 should be [ 'abc\n\'"/\\', 'ABC\n\'"/\\' ]
var z4 = "Qabc\n'\"/\\xyzABC\n'\"/\\Q".replace(/abc\n'"\/\\/ig, "x");
// z4 should be 'QxxyzxQ'
var z5 = /^text\/html;/.test("text/html; quality=2");
// z5 should be true
