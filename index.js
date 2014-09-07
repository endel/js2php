var fs = require('fs'),
    core = require('./core');
    esprima = require('esprima-fb');

module.exports = function(file) {
  var ast = esprima.parse(fs.readFileSync(file).toString(), {
    loc : true,
    range : true,
    tokens : true,
    comment : true,
  });

  function getTokens(range) {
    return ast.tokens.filter(function(token) {
      return token.range[0] >= range[0] && token.range[1] <= range[1];
    });
  }

  function visit(node, parent) {
    var content = "", semicolon = false;

    // set parent node
    if (parent) { node.parent = parent; }

    if (node.type == "Program" ||
        node.type == "BlockStatement" ||
        node.type == "ClassBody") {

      for (var i=0,length = node.body.length;i<length;i++) {
        content += visit(node.body[i], node.body[i+1], (i == length-1), node);
      }

    } else if (node.type == "VariableDeclaration") {
      // declaration of one or multiple variables
      for (var i=0,length=node.declarations.length;i<length;i++) {
        content += visit(node.declarations[i], node);
      }

    } else if (node.type == "VariableDeclarator") {
      // declaration of one variable
      content = '$' + node.id.name;

      if (node.init) {
        content += ' = ' + visit(node.init, node);
        semicolon = true;
      }

    } else if (node.type == "Identifier") {
      var identifier = (node.name || node.value);

      if (!node.static && !node.isCallee && !node.isMemberExpression) {
        content = "$";
      }

      content += identifier;

    } else if (node.type == "Punctuator") {
      content = node.value;

    } else if (node.type == "Literal") {
      content = node.raw;

    } else if (node.type == "BinaryExpression" || node.type == "LogicalExpression") {
      content = visit(node.left, node) + " " + node.operator + " " + visit(node.right, node);

    } else if (node.type == "AssignmentExpression") {
      content = visit(node.left, node) + " " + node.operator + " " + visit(node.right, node);
      semicolon = true;

    } else if (node.type == "ExpressionStatement") {
      content = visit(node.expression, node);

    } else if (node.type == "CallExpression") {
      node.callee.isCallee = true;
      content = visit(node.callee, node);

      // call expression were overriden, let's return as it is
      // TODO: support nested custom calls. Example: `.substr(1).toLowerCase()`
      if (node.callee.property && core[node.callee.property.name]) {
        return content;
      }

      if (node.arguments) {
        var arguments = [];

        for (var i=0, length = node.arguments.length; i < length; i++) {
          arguments.push( visit(node.arguments[i], node) );
        }

        content += "(" + arguments.join(', ') + ")";
      }

      // allow semicolon if parent node isn't MemberExpression or Property
      if (node.parent.type !== "MemberExpression" &&
          node.parent.type !== "Property" &&
          node.parent.type !== "LogicalExpression" &&
          node.parent.type !== "CallExpression") {
        semicolon = true;
      }

    } else if (node.type == "MemberExpression") {
      var newNode = node;

      // is a core function?
      if (core[node.property.name]) {
        var originalType = node.type;
        newNode = core[node.property.name](node);
      }

      if (node != newNode) {
        content = visit(newNode, node.parent);

      } else {
        var accessor = (node.object.static) ? "::" : "->";
        node.object.static = (node.object.name || node.object.value || "").match(/^[A-Z]/);

        if (node.computed) {
          content = visit(node.object, node) + "[" + visit(node.property, node) + "]";
        } else {
          node.property.isMemberExpression = true;
          content = visit(node.object, node) + accessor + visit(node.property, node);
        }
      }

    } else if (node.type == "FunctionDeclaration") {
      var param,
          parameters = [],
          defaults = node.defaults || [];

      // compute function params
      for (var i=0; i < node.params.length; i++) {
        if (defaults[i]) {
          param = visit({
            type: "BinaryExpression",
            left: node.params[i],
            operator: '=',
            right: defaults[i]
          }, node);
        } else {
          param = visit(node.params[i], node)
        }

        parameters.push(param);
      }

      content = "function " + node.id.name;
      content += "("+parameters.join(", ")+") {\n";
      content += visit(node.body, node);
      content += "}\n";

    } else if (node.type == "ObjectExpression") {
      var properties = [];
      for (var i=0; i < node.properties.length; i++) {
        properties.push( visit(node.properties[i], node) )
      }
      content = "array(" + properties.join(", ") + ")";

    } else if (node.type == "ArrayExpression") {
      var elements = [];
      for (var i=0; i < node.elements.length; i++) {
        elements.push( visit(node.elements[i], node) )
      }
      content = "array(" + elements.join(", ") + ")";

    } else if (node.type == "Property") {
      content = '"'+node.key.name+'" => ' + visit(node.value, node);

    } else if (node.type == "ReturnStatement") {
      semicolon = true;
      content = "return";

      if (node.argument) {
        content += " " + visit(node.argument, node);
      }

    } else if (node.type == "ClassDeclaration") {
      content = "class " + node.id.name

      if (node.superClass) {
        content += " extends " + node.superClass;
      }

      content += "\n{\n" + visit(node.body, node) + "\n}\n";

    } else if (node.type == "MethodDefinition") {

      // every method is public.
      content = "public ";
      if (node.static) { content += "static "; }

      if (node.key.name == "constructor") {
        node.key.name = "__construct";
      }

      // Re-use FunctionDeclaration structure for method definitions
      node.value.type = "FunctionDeclaration";
      node.value.id = { name: node.key.name };

      content += visit(node.value, node);

    } else if (node.type == "ThisExpression") {
      content = "$this";

    } else if (node.type == "IfStatement") {
      content = "if ("+visit(node.test, node)+") {\n";
      content += visit(node.consequent, node) + "}";

      if (node.alternate) {
        content += " else ";

        if (node.alternate.type == "BlockStatement") {
          content += "{"+visit(node.alternate, node)+"}";

        } else {
          content += visit(node.alternate, node)
        }
      }

    } else if (node.type == "ForStatement") {
      content = "for (";
      content += visit(node.init, node);
      content += visit(node.test, node) + ";" ;
      content += visit(node.update, node);
      content += ") {";
      content += visit(node.body, node);
      content += "}";

    } else if (node.type == "ForInStatement") {
      content = "foreach (" + visit(node.right, node) + " as " + visit(node.left)+ " => $___)";
      content += "{" + visit(node.body, node) + "}";

    } else if (node.type == "UpdateExpression") {
      content = visit(node.argument, node) + node.operator;

    } else if (node.type == "SwitchStatement") {
      content = "switch (" + visit(node.discriminant, node) + ")";
      content += "{";
      for (var i=0; i < node.cases.length; i++) {
        content += visit(node.cases[i], node) + "\n";
      }
      content += "}";

    } else if (node.type == "SwitchCase") {

      if (node.test) {
        content += "case " + visit(node.test, node) + ":\n";
      } else {
        content =  "default:\n";
      }

      for (var i=0; i < node.consequent.length; i++) {
        content += visit(node.consequent[i], node);
      }

    } else if (node.type == "BreakStatement") {
      content = "break;";

    } else if (node.type == "NewExpression") {
      // re-use CallExpression for NewExpression's
      node.type = "CallExpression";

      return "new " + visit(node, node);

    } else {
      console.log("'" + node.type + "' not implemented.", node);
    }

    // append semicolon when required
    if (semicolon && !content.match(/;\n?$/)) {
      content += ";\n";
    }

    return content;
  }

  return "<?php\n" + visit(ast);
}
