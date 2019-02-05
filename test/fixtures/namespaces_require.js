/* Initial comment */
'use strict';

const { Foo, Bar } = require('./some/path/here.js');
const Bat = require('bat');
const semver = require('semver');

Foo.do_something();
Bar.do_something();
Bat.do_something();
Bat.do_something().do_something_else();
echo(semver.satisfies(1,2));
echo(semver.satisfies(1,2).something_else());
echo({ Foo, Bar });
