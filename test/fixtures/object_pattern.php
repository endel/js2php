<?php
$x = [ "foo" => 'foo', "bar" => 42 ];
$temp0 = $x; $foo = $temp0->foo; $bar = $temp0->bar;
$y = 'not foo';
( ( ( function () use ( &$x ) { $temp1 = $x; return $y = $temp1->foo;  } ) )() );
var_dump( "{$foo} {$bar} {$y}" );
