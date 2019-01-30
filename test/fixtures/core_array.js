var items = ["One", "Two", "Three"];

items.unshift("Zero");
items.shift();
items.push("Four");
items.push("Four", "Five");

var_dump(items);
echo(items.join(", "))

echo(items.length)
echo(items.indexOf({name: "Three"}))
echo(items.join(", "))
echo("\n");

var count = items.reduce(function(curr, string) {
    return curr + string.length;
}, 0);
var_dump(count);

var_dump(Array.isArray(items));
var_dump(Array.isArray(count));
