<?php
$x = function ( ...$args ) {return  count( $args ); };
$y = function ( $z ) use ( &$x ) {return  $x( ...$z ); };

var_dump( $x( 1, 2, 3, 4 ) );
var_dump( $y( [ 1, 2, 3 ] ) );
