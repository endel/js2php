<?php
function something($x, $y = "something", $z = 5) {
var_dump($x, $y, $z);
}
function sum($a, $b) {
return $a + $b;
}
function hello($a, $b) {
return "hello!";
}
$total = 0;
function add($x) {
$total += $x;
}
var_dump(call_user_func_array('hello', array(5, 6)));
var_dump(hello(5, 6));
add(1);
add(2);
var_dump($$total);

