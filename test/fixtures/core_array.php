<?php
$items = [ 'One', 'Two', 'Three' ];

array_unshift( $items, 'Zero' );
array_shift( $items );
$items[] = 'Four';
array_push( $items, 'Four', 'Five' );

var_dump( $items );
echo( implode( ', ', $items ) );

echo( count( $items ) );
echo( array_search( [ 'name' => 'Three' ], $items ) );
echo( implode( ', ', $items ) );
echo( "\n" );

$count = array_reduce( $items, function ( $curr, $string ) {
		return $curr + strlen( $string );
	}, 0
)

;
var_dump( $count );

var_dump( is_array( $items ) );
var_dump( is_array( $count ) );

/* This might not work, but it shouldn't crash! */
$a = array_slice( [ 1, 2, 3 ], 1 );
var_dump( $a );
