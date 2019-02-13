<?php
$x = 1; $y = 50;
$ternary = ( $x == 1 ) ? 'Yes' : 'No';

var_dump( $ternary );

var_dump( $x < $y );
var_dump( $x == 2 );

if ( $x < $y ) {
	echo( 'x < y' );
} elseif ( $x == 2 ) {
	echo( 'x==2' );
} else {
	echo( 'else...' );
}

switch ( $x ) {
	case 5:
	echo( 'Five!' );
	case 1:
	echo( 'One!' );
	default:
	echo( 'Default!' );
}
