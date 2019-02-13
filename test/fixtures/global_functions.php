<?php
$integer = intval( '50' );
$float = floatval( '50.50' );

var_dump( $integer );
var_dump( $float );

$temp = '50.50';
var_dump( intval( $temp ) );
var_dump( floatval( $temp ) );
