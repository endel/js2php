var fs = require('fs'),
    esprima = require('esprima-fb');

var exampleKlass = fs.readFileSync('examples/klass_example.js').toString();
var exampleSimple = fs.readFileSync('examples/simple.js').toString();

var ast = esprima.parse(exampleSimple);

function visit(node, level) {
  var content = "";

  level = (typeof(level)==='undefined') ? 0 : level;

  var tmp = "";

  if (node.type == "VariableDeclaration") {
    for (var i=0;i<node.declarations.length;i++) {
      tmp += visit(node.declarations[i]);
    }

  } else if (node.type == "VariableDeclarator") {
    tmp = '$' + node.id.name + ' = ' + visit(node.init) + ";\n"

  } else if (node.type == "Identifier") {
    tmp = "$" + node.name;

  } else if (node.type == "Literal") {
    tmp = node.raw;

  } else if (node.type == "BinaryExpression") {
    tmp = visit(node.left) + " " + node.operator + " " + visit(node.right);

  } else if (node.type == "Program") {
    for (var i=0;i<node.body.length;i++) {
      tmp += visit(node.body[i]);
    }
  }

  content += tmp;

  return content;
}

console.log("<?php\n" + visit(ast));
// console.log(JSON.stringify(ast, null, 4));
