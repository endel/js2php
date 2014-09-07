var str = "Hello";
var items = ["One", "Two", "Three"];

var_dump("something".toUpperCase())
var_dump(items.length)

echo("    trimmed".trimLeft());
echo("trimmed    ".trimRight());
echo("    trimmed    ".trim());

items.unshift("Zero");
items.shift();
items.push("Four");

var_dump(items);
echo(items.join(", "))

echo(str.toUpperCase().substr(1));
echo(str.toLowerCase());
echo(str.substr(1));

echo(items.length)
echo(items.indexOf({name: "Three"}))
echo(items.join(", "))

if (str.match(/endel/)) {
  var_dump(str);
}
