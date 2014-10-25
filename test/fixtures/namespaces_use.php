<?php
namespace Math\Formulas;
class Formula
{
public function __construct() {
}
public static function do_something() {
var_dump("Something!");
}

}
class Hello
{
public static function do_something() {
var_dump("Something!");
}

}
function sum($x, $y) {
return $x + $y;
}
$pi = 3.141593;
use \Math\Formulas\Formula as Formula1;
use \Math\Formulas\Hello;
Formula1::do_something();
Hello::do_something();
