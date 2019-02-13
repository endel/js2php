var str = "Hello";
echo("    trimmed    ".trim().trim().substr(1).trim().trim().trim());

var_dump("hello".replace("lo", "ium").toUpperCase())

var_dump("something".toUpperCase())
var_dump("something".indexOf("meth"))

echo("    trimmed".trimLeft());
echo("trimmed    ".trimRight());

echo(str.toUpperCase().substr(1));
echo(str.toLowerCase());
echo(str.substr(1));

// output 'say Goodnight'
var replace_stuff = 'say Hello';
echo(replace_stuff.replace(str, 'Goodnight'));

// output 'Hello Hello
var replace_stuff2 = 'say Hello';
echo(replace_stuff2.replace('say', str));

// test explode
var strArray = str.split('ll');
echo(strArray[0]);

// test str_split
var strArray2 = str.split('');
echo(strArray2[0]);

// shouldn't crash with identifier as argument.
var xyz = 'll';
var strArray3 = str.split(xyz);
echo(strArray3[0]);

var_dump('testing'.length);

var test_length = 'testing_string_variable';
var_dump(test_length.length);

function lengthTest1(string) {
  var_dump(string.length);
}
function lengthTest2(string) {
  var_dump(string.length);
}
lengthTest1('hmm');
var temp = 'hmmm';
lengthTest2(temp);

if (str.match(/endel/)) {
  var_dump(str);
}

var_dump("Strings with funny characters like \n and $foo and {$foo}");
var_dump('\\\\');

function foo() { return "x"; }

var x = "foo" + foo();
var y = foo() + 'bar';
var z = foo() + "bar" + foo();

var typeOf = node.getAttribute('typeof');
var_dump(typeOf.match('begin'));
