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


if (str.match(/endel/)) {
  var_dump(str);
}
