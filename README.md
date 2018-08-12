js2php
===

[![Build status](https://travis-ci.org/endel/js2php.svg?branch=master)](https://travis-ci.org/endel/js2php)

JavaScript to PHP source-to-source transpiler.  [Online demo](http://endel.github.io/js2php)

**This is an experiment. Please do not use it.**

Installation
---

- Install [nodejs](http://nodejs.org/)
- Install js2php globally: `npm install -g js2php`

Usage
---

Convert a single JavaScript file into PHP:

```
js2php examples/simple.js > simple.php
```

Since `js2php` outputs the PHP code to stdout, you may run it right after
conversion:

```
js2php examples/class.js | php
```

Features
---

What does it converts?

- Classes (ES6)
- Getters and Setters (ES6)
- Namespaces (ES6)
- Loops (while / for / do-while / for-of / for-in)
- Arrow functions (ES6)
- Template strings (ES6)
- Functions and closures
- Conditionals
- [Core JavaScript](core)
  - Array
    - Array.prototype.unshift
    - Array.prototype.shift
    - Array.prototype.reverse
    - Array.prototype.push
    - Array.prototype.pop
    - Array.prototype.join
    - Array.prototype.splice
    - Array.prototype.indexOf
    - Array.prototype.length
  - JSON
    - JSON.parse
    - JSON.stringify
  - Math
    - Math.E
    - Math.LN2
    - Math.LN10
    - Math.LOG2E
    - Math.LOG10E
    - Math.PI
    - Math.SQRT2
    - Math.SQRT1_2
    - Math.abs
    - Math.acos
    - Math.acosh
    - Math.asin
    - Math.asinh
    - Math.atan
    - Math.atanh
    - Math.atan2
    - Math.cbrt
    - Math.ceil
    - Math.clz32
    - Math.cos
    - Math.cosh
    - Math.exp
    - Math.expm1
    - Math.floor
    - Math.hypot
    - Math.log
    - Math.log1p
    - Math.log10
    - Math.max
    - Math.min
    - Math.pow
    - Math.random
    - Math.round
    - Math.sin
    - Math.sinh
    - Math.sqrt
    - Math.tan
    - Math.tanh
  - Number
    - Number.isInteger
    - Number.isFinite
  - String
    - String.prototype.replace
    - String.prototype.trim
    - String.prototype.trimRight
    - String.prototype.trimLeft
    - String.prototype.toUpperCase
    - String.prototype.toLowerCase
    - String.prototype.split
    - String.prototype.substr
    - String.prototype.match
  - Function
    - Function.prototype.apply
    - Function.prototype.call
  - Date
    - Date.now

Testing
---

Tests are simple input (js) / output (php) comparisions.

1. Create your source `.js` file at `test/fixtures/js_feature.js`
2. Convert your `.js` to `.php` manually: `node test/generate.js js_feature.js`
3. Run `npm test`

License
---

MIT
