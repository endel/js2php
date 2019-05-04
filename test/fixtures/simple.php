<?php
$x = 50;
$y = 20;
$z = $x + $y;

$console->log( $x, $y );
$console->log( $z );

var_dump( [ 'a' => 1, 'b-c' => 'c', 'd-e-fh' => g( 0 ), 'hi' => 'hi' ] );

$obj = [ 'key' => 'value', 'key2' => 'value2' ];
unset( $obj[ 'key' ] );
var_dump( isset( $something[ 'key2' ] ) );
var_dump( gettype( $something ) !== NULL );
