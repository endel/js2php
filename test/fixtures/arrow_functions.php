<?php
$something = function ( $a, $b = 2, $c = 4 ) {
	return $a * $b * $c;
};
$something2 = function ( $a, $b = 2, $c = 4 ) {return  $a * $b * $c; };

$something3 = function () {return  5; };

var_dump( $something3() );
