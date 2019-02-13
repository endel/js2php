<?php
$items = [
	[ 'name' => 'one' ],
	[ 'name' => 'two' ],
	[ 'name' => 'three' ]
];

foreach ( $items as $item => $___ ) {
	echo( $item[ 'name' ] );
	continue;
}
