<?php
$string1 = 'string1';
$string2 = 'string2';
$string3 = $string1 . $string2;
$string4 = null;

var_dump( $string1 . $string2 );

// Avoid a crash if/when one side of the operator is undefined at init
$string4 = 'later';
var_dump( $string1 + $string4 );
