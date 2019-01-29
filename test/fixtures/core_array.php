<?php
$items = ["One", "Two", "Three"];

array_unshift($items, "Zero");
array_shift($items);
array_push($items, "Four");

var_dump($items);
echo(join(", ", $items));

echo(count($items));
echo(array_search(["name" => "Three"], $items));
echo(join(", ", $items));

