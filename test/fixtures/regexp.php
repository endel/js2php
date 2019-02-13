<?php
$one = preg_match( '/llo/', 'Hello' );
var_dump( $one );

$two = preg_match_all( '/llo/', 'Hello', $FIXME );
var_dump( $two );

$splitted = explode( ',', 'one, two, three' );
var_dump( $splitted );

$splitted = preg_split( '/,/', 'one, two, three' );
var_dump( $splitted );

$g_splitted = preg_split( '/,/', 'one, two, three' );
var_dump( $g_splitted );

var_dump( str_replace( 'y', 'llo', 'hey' ) );
var_dump( preg_replace( '/y/', 'llo', 'hey', 1 ) );
var_dump( preg_replace( '/y/', 'llo', 'hey hey hey', 1 ) );
var_dump( preg_replace( '/y/', 'llo', 'hey hey hey' ) );

$string = 'hello';
$regex = 'ello';
$nonliteral = preg_match( $regex, $string );

var_dump( preg_match( '/abc\n[\/]/', 'def' ) );
var_dump( substr( '[\n]', 1, -1 ) );

var_dump( preg_replace( '/\.\//', '', './a/b/c', 1 ) );

$matches = /*RegExp#exec*/preg_match_all( '/[abc]/i', 'LA la black sheep', $FIXME );

$firstA = unknownValue();
if ( $firstA && preg_match( '/^#/', $firstA->getAttribute( 'href' ) ) ) {
	var_dump( 'whoo' );
}

// Tricky escape cases.
$x = "abc\\n'\"\\/\\\\"; // should be "abc\\n'\"\\/\\\\"
$y = preg_match( "/abc\\n'\"\\/\\\\/", "ABC\n'\"/\\" ); // should be true
// This only returns one match, but it uses the lastIndex property:
$z1 = /*RegExp#exec*/preg_match_all( "/abc\\n'\"\\/\\\\/i", "abc\n'\"/\\xyzABC\n'\"/\\", $FIXME );
$z2 = preg_split( "/abc\\n'\"\\/\\\\/i", "Qabc\n'\"/\\xyzABC\n'\"/\\Q" );
// z2 should be [ 'Q', 'xyz', 'Q' ]
$z3 = preg_match_all( "/abc\\n'\"\\/\\\\/i", "Qabc\n'\"/\\xyzABC\n'\"/\\Q", $FIXME );
// z3 should be [ 'abc\n\'"/\\', 'ABC\n\'"/\\' ]
$z4 = preg_replace( "/abc\\n'\"\\/\\\\/i", 'x', "Qabc\n'\"/\\xyzABC\n'\"/\\Q" );
// z4 should be 'QxxyzxQ'
$z5 = preg_match( '/^text\/html;/', 'text/html; quality=2' );
// z5 should be true
