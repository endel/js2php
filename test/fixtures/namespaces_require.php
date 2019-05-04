<?php
/* Initial comment */
namespace NameTest;

use NameTest\Foo as Foo;
use NameTest\Bar as Bar;
use NameTest\Bat as Bat;
use NameTest\semver as semver;
use NameTest\Negotiator as Negotiator;

Foo::do_something();
Bar::do_something();
Bat::do_something();
Bat::do_something()->do_something_else();
echo( semver::satisfies( 1, 2 ) );
echo( semver::satisfies( 1, 2 )->something_else() );
echo( [ 'Foo' => Foo::class, 'Bar' => Bar::class ] );

$foo = 3;
$n = new Negotiator( $foo );
