<?php

function something( $x, $y = 'something', $z = 5 ) {
	var_dump( $x, $y, $z );
}

function sum( $a, $b ) {
	return $a + $b;
}

function hello( $a, $b ) {
	return 'hello!';
}

var_dump( call_user_func_array( 'hello', [ 5, 6 ] ) );
var_dump( hello( 5, 6 ) );

$args = [ 5, 6 ];
var_dump( call_user_func_array( 'sum', $args ) );

$foo = function /* bar */() {};

// var_dump(something(5), sum(1,2));
