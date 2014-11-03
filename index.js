var core = require('./core'),
    scope = require('./scope'),
    utils = require('./utils'),
    esprima = require('esprima-fb');

module.exports = function(code) {
  var ast = esprima.parse(code, {
    loc : true,
    range : true,
    tokens : true,
    comment : true,
  });

  var rootScope = scope.create(ast, scope.KIND_ROOT);

  function visit(node, parent) {
    var content = "", semicolon = false;

    // set parent node
    if (parent) { node.parent = parent; }

    if (node.type == "Program" || node.type == "BlockStatement" || node.type == "ClassBody") {

      for (var i=0,length = node.body.length;i<length;i++) {
        content += visit(node.body[i], node);
      }

    } else if (node.type == "VariableDeclaration") {
      // declaration of one or multiple variables
      for (var i=0,length=node.declarations.length;i<length;i++) {
        content += visit(node.declarations[i], node);
      }

    } else if (node.type == "VariableDeclarator") {
      scope.get(node).register(node);

      // declaration of one variable
      content = '$' + node.id.name;

      if (node.init) {
        content += ' = ' + visit(node.init, node);
        semicolon = true;
      } else if (node.parent.parent.type !== "ForInStatement" &&
                 node.parent.parent.type !== "ForStatement") {
        content += ' = null';
        semicolon = true;
      }

    } else if (node.type == "Identifier") {
      var identifier = (node.name || node.value);

      if (!node.static && !node.isCallee && !node.isMemberExpression) {
        scope.get(node).getDefinition(node);
        content = "$";
      }

      content += identifier;

    } else if (node.type == "Punctuator") {
      content = node.value;

    } else if (node.type == "Literal") {

      var value = (node.raw.match(/^["']undefined["']$/)) ? "NULL" : node.raw;
      content = value;

    } else if (node.type == "BinaryExpression" || node.type == "LogicalExpression") {

      if (node.operator == 'in') {
        content = visit({
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'isset',
          },
          arguments: [{
            type: 'MemberExpression',
            computed: true,
            object: node.right,
            property: node.left
          }]
        }, node);

      } else {
        content = visit(node.left, node) + " " + node.operator + " " + visit(node.right, node);
      }

    } else if (node.type == "AssignmentExpression") {
      scope.get(node).register(node.left);

      content = visit(node.left, node) + " " + node.operator + " " + visit(node.right, node);

    } else if (node.type == "ConditionalExpression") {
      content = "(" + visit(node.test, node) + ")" +
        " ? " + visit(node.consequent, node) +
        " : " + visit(node.alternate, node);

    } else if (node.type == "UnaryExpression") {

      // override typeof unary expression
      if (node.operator == 'typeof') {
        content = visit({
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'gettype',
          },
          arguments: [node.argument]
        }, node);

      // override delete unary expression
      } else if (node.operator == 'delete') {
        content = visit({
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'unset',
          },
          arguments: [node.argument]
        }, node);

      } else {
        content = node.operator + visit(node.argument, node);
      }

    } else if (node.type == "ExpressionStatement") {
      content = visit(node.expression, node);
      semicolon = true;

    } else if (node.type == "CallExpression") {

      var calleeDefined = scope.get(node).getDefinition(node.callee);

      node.callee.isCallee = (!calleeDefined || calleeDefined && (calleeDefined.type != "Identifier" &&
                                                                  calleeDefined.type != "VariableDeclarator"));

      content += visit(node.callee, node);

      // inline anonymous call
      if (node.callee.isCallee && node.callee.type == "FunctionDeclaration") {
        var identifier = null;
        if (node.parent.type == "VariableDeclarator") {
          // var something = (function() { return 0; })();
          identifier = node.parent.id.name;
        } else if (node.parent.type == "AssignmentExpression") {
          // something = (function() { return 0; })();
          identifier = node.parent.left.name;
        }
        content += ";$" + identifier + " = " + "$" + identifier;
      }

      if (node.arguments) {
        var arguments = [];

        for (var i=0, length = node.arguments.length; i < length; i++) {
          arguments.push( visit(node.arguments[i], node) );
        }

        content += "(" + arguments.join(', ') + ")";
      }

      // allow semicolon if parent node isn't MemberExpression or Property
      if (node.parent && node.parent.type == "ExpressionStatement") {
        semicolon = true;
      }

    } else if (node.type == "MemberExpression") {
      var newNode = core.evaluate(node);

      if (node != newNode) {
        // fix parent node type
        content = visit(newNode, node.parent);

      } else {

        var object, property;

        if (node.object.type == "MemberExpression" && node.object.object && node.object.property) {
          object = node.object.object,
          property = node.object.property;
        } else {
          object = node.object;
          property = node.property;
        }

        object.static = (object.name || object.value || "").match(/^[A-Z]/);
        property.static = (property.name || property.value || "").match(/^[A-Z]/);

        var accessor;
        if (node.property.static && object.static) {
          accessor = "\\"; // namespace
        } else if (property.static || object.static) {
          accessor = "::"; // static
        } else {
          accessor = "->"; // instance
        }

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

      // function declaration creates a new scope
      scope.create(node);

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

        // register parameter identifiers
        if (scope.get(node).parent) {
          scope.get(node).register(node.params[i]);
        }

        parameters.push(param);
      }

      var func_contents = visit(node.body, node),
          using = scope.get(node).using;

      content = "function " + node.id.name;
      content += "(" + parameters.join(", ") + ") ";

      // try to use parent's variables
      // http://php.net/manual/pt_BR/functions.anonymous.php
      if (using.length > 0) {
        content += "use (" + using.map(function(identifier) {
          return "&$" + identifier;
        }).join(', ') + ") ";
      }

      content += "{\n";
      content += func_contents;
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
      var property = (node.key.type == 'Identifier') ? node.key.name : node.key.value;
      content = '"'+property+'" => ' + visit(node.value, node);

    } else if (node.type == "ReturnStatement") {
      semicolon = true;
      content = "return";

      if (node.argument) {
        content += " " + visit(node.argument, node);
      }

    } else if (node.type == "ClassDeclaration") {
      content = "class " + node.id.name

      if (node.superClass) {
        content += " extends " + node.superClass.name;
      }

      var s = scope.create(node);
      content += "\n{\n";
      content += visit(node.body, node);

      if (s.getters.length > 0) {
        content += "function __get($_property) {\n";
        for (var i=0;i<s.getters.length;i++) {
          content += "if ($_property === '"+s.getters[i].key.name+"') {\n";
          content += visit(s.getters[i].value.body, node);
          content += "}\n";
        }
        content += "}\n";
      }

      if (s.setters.length > 0) {
        content += "function __set($_property, $value) {\n";
        for (var i=0;i<s.setters.length;i++) {
          content += "if ($_property === '"+s.setters[i].key.name+"') {\n";
          content += visit(s.setters[i].value.body, node);
          content += "}\n";
        }
        content += "}\n";
      }

      content += "\n}\n";


    } else if (node.type == "MethodDefinition") {
      scope.get(node).register(node);

      // define getters and setters on scope
      if (node.kind == "get" || node.kind == "set") {
        return "";
      }

      var isConstructor = (node.key.name == "constructor");
      if (isConstructor) { node.key.name = "__construct"; }

      // Re-use FunctionDeclaration structure for method definitions
      node.value.type = "FunctionDeclaration";
      node.value.id = { name: node.key.name };

      var tmpContent = visit(node.value, node);

      // try to define public properties there were defined on constructor
      if (isConstructor) {
        node.key.name = "__construct";
        var definitions = scope.get(node.value).definitions;
        for(var i in definitions) {
          if (definitions[i] && definitions[i].type == "MemberExpression") {
            definitions[i].property.isMemberExpression = false;
            content += "public " + visit(definitions[i].property, null) + ";\n";
          }
        }
      }

      // every method is public.
      content += "public ";
      if (node.static) { content += "static "; }

      content += tmpContent;

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

    } else if (node.type == "SequenceExpression") {
      var expressions = [];

      for (var i=0;i<node.expressions.length;i++) {
        expressions.push( visit(node.expressions[i], node) );
      }

      content = expressions.join(', ') + ";";

    } else if (node.type == "WhileStatement") {

      content = "while (" + visit(node.test, node) + ") {";
      content += visit(node.body, node);
      content += "}";

    } else if (node.type == "DoWhileStatement") {

      content = "do {";
      content += visit(node.body, node);
      content += "} while (" + visit(node.test, node) + ")";
      semicolon = true;

    } else if (node.type == "ForStatement") {
      content = "for (";
      content += visit(node.init, node);
      content += visit(node.test, node) + ";" ;
      content += visit(node.update, node);
      content += ") {";
      content += visit(node.body, node);
      content += "}";

    } else if (node.type == "ForInStatement") {
      content = "foreach (" + visit(node.right, node) + " as " + visit(node.left, node)+ " => $___)";
      content += "{" + visit(node.body, node) + "}";

    } else if (node.type == "UpdateExpression") {

      if (node.prefix) {
        content += node.operator;
      }

      content += visit(node.argument, node);

      if (!node.prefix) {
        content += node.operator;
      }

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
      var newNode = utils.clone(node);
      newNode.type = "CallExpression";

      return "new " + visit(newNode, node);

    } else if (node.type == "FunctionExpression") {

      // Re-use FunctionDeclaration structure for method definitions
      node.type = "FunctionDeclaration";
      node.id = { name: node.id || "" };

      content = visit(node, node.parent);


      // Modules & Export (http://wiki.ecmascript.org/doku.php?id=harmony:modules_examples)
    } else if (node.type == "ModuleDeclaration") {
      content = "namespace " + utils.classize(node.id.value) + ";\n";
      content += visit(node.body, node);

    } else if (node.type == "ExportDeclaration") {
      content = visit(node.declaration, node);

    } else if (node.type == "ImportDeclaration") {
      for (var i=0,length = node.specifiers.length;i<length;i++) {
        content += visit(node.specifiers[i], node);
      }

    } else if (node.type == "ImportSpecifier") {
        var namespace = utils.classize(node.parent.source.value);
        content += "use \\" + namespace + "\\" + node.id.name;

        // alias
        if (node.name) { content += " as " + node.name.name; }

        content += ";\n";

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
