<?php
$total = 0;
function add( $x ) {
	global $total;
	$total;
	$total += $x;
}
add( 10 );
var_dump( $total );
