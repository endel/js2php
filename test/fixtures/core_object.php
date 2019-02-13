<?php
$a = [];
$a[ 'foo' ] = 'bar';
var_dump( $a );

// Avoid a crash when looking up a method named hasOwnProperty
$b = [];
var_dump( $b->hasOwnProperty( 'foo' ) );
