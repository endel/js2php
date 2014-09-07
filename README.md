js-to-php
===

JavaScript to PHP source-to-source transpiler.

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

License
---

MIT
