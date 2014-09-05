var fs = require('fs'),
    esprima = require('esprima-fb');

var exampleFile = fs.readFileSync('examples/klass_example.js').toString();
var ast = esprima.parse(exampleFile);
console.log(JSON.stringify(ast, null, 4));
