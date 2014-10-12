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

if (str.match(/endel/)) {
  var_dump(str);
}
