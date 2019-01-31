<?php


use Bat;

$bar = /* async */function ($x) {
	return (/* await */ Bat::bat());
}

;

class Foo {
	public function __construct() {$this->x = 1;}
	public $x;
}