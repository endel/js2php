<?php
$str = 'Hello';
echo( trim( trim( trim( substr( trim( trim( '    trimmed    ' ) ), 1 ) ) ) ) );

var_dump( strtoupper( str_replace( 'lo', 'ium', 'hello' ) ) );

var_dump( strtoupper( 'something' ) );
var_dump( strpos( 'something', 'meth' ) );

echo( ltrim( '    trimmed' ) );
echo( rtrim( 'trimmed    ' ) );

echo( substr( strtoupper( $str ), 1 ) );
echo( strtolower( $str ) );
echo( substr( $str, 1 ) );

// output 'say Goodnight'
$replace_stuff = 'say Hello';
echo( str_replace( $str, 'Goodnight', $replace_stuff ) );

// output 'Hello Hello
$replace_stuff2 = 'say Hello';
echo( str_replace( 'say', $str, $replace_stuff2 ) );

// test explode
$strArray = explode( 'll', $str );
echo( $strArray[ 0 ] );

// test str_split
$strArray2 = str_split( $str );
echo( $strArray2[ 0 ] );

// shouldn't crash with identifier as argument.
$xyz = 'll';
$strArray3 = explode( $xyz, $str );
echo( $strArray3[ 0 ] );

var_dump( strlen( 'testing' ) );

$test_length = 'testing_string_variable';
var_dump( strlen( $test_length ) );

function lengthTest1( $string ) {
	var_dump( strlen( $string ) );
}
function lengthTest2( $string ) {
	var_dump( strlen( $string ) );
}
lengthTest1( 'hmm' );
$temp = 'hmmm';
lengthTest2( $temp );

if ( preg_match( '/endel/', $str ) ) {
	var_dump( $str );
}

var_dump( "Strings with funny characters like \n and \$foo and {\$foo}" );
var_dump( '\\\\' );

function foo() { return 'x';  }

$x = 'foo' . foo();
$y = foo() . 'bar';
$z = foo() . 'bar' . foo();

$typeOf = $node->getAttribute( 'typeof' );
var_dump( preg_match( '/begin/', $typeOf ) );
