'use strict';
require('core-update.js');
const { Bat } = require('some/thing');

var bar = Promise.async(function *(x) {
    return (yield Bat.bat());
});

class Foo {
    constructor() { this.x = 1; }
}
