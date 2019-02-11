<?php


use Bat;

$bar = /* async */function ( $x ) use ( &$Bat ) {
	return ( /* await */ Bat::bat() );
}

;

class Foo {
	public function __construct() { $this->x = 1;  }
	public $x;
}
