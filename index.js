var core = require('./core'),
    scope = require('./scope'),
    utils = require('./utils'),
    espree = require('espree');

module.exports = function(code, options) {
  options = options || {};
  if (options.braced) {
    // special option to handle code inside braced regions only
    var nest = 0, quote = null, outside = '', inside = '';
    var noptions = Object.assign({}, options, {
      braced: false, watermark: false, noOpenTag: true, indent: 1,
    });
    if (options.watermark) { outside += `/* ${options.watermark} */\n`; }
    code.split(
      //  /([{}]|\/\*(?:(?!\*\/).)*\*\/|\/\/[^\n]*(?:\n|$)|"[^"]*"|'[^']'|\[[^\]]*\])/mg
      /([{}'"\[\]]|\/\*|\*\/|\/\/|\n)/g
    ).forEach(function(chunk) {
      var isStartQuote = (nest === 0) &&
          (chunk==='"' || chunk==="'" || chunk==='[' || chunk==='/*' || chunk==='//');
      if (quote || isStartQuote) {
        var trailingBackslash = outside.endsWith('\\');
        outside += chunk;
        if (chunk === quote && !trailingBackslash) { quote = null; }
        else if (!quote) {
          switch (chunk) {
          case '/*' : quote = '*/'; break;
          case '//': quote = '\n'; break;
          case '[': quote = ']'; break;
          default: quote = chunk; break;
          }
        }
        return;
      }
      if (chunk==='}') { nest--; }
      if (nest <= 0) {
        if (inside) {
          outside += module.exports(inside, noptions);
          inside = '';
        }
        outside += chunk;
        nest = 0;
      } else {
        inside += chunk;
      }
      if (chunk==='{') { nest++; }
    });
    if (inside) { outside += module.exports(inside, noptions); }
    return outside;
  }
  var useConciseArrays = (options.conciseArrays === false) ? false : true;
  var ast = espree.parse(code, {
    loc : true,
    range : true,
    tokens : true,
    comment : true,
    attachComment: true,
    ecmaFeatures: {
      arrowFunctions: true, // enable parsing of arrow functions
      blockBindings: true, // enable parsing of let/const
      destructuring: true, // enable parsing of destructured arrays and objects
      regexYFlag: true, // enable parsing of regular expression y flag
      regexUFlag: true, // enable parsing of regular expression u flag
      templateStrings: true, // enable parsing of template strings
      binaryLiterals: true, // enable parsing of binary literals
      octalLiterals: true, // enable parsing of ES6 octal literals
      unicodeCodePointEscapes: true, // enable parsing unicode code point escape sequences
      defaultParams: true, // enable parsing of default parameters
      restParams: true, // enable parsing of rest parameters
      forOf: true, // enable parsing of for-of statement
      objectLiteralComputedProperties: true, // enable parsing computed object literal properties
      objectLiteralShorthandMethods: true, // enable parsing of shorthand object literal methods
      objectLiteralShorthandProperties: true, // enable parsing of shorthand object literal properties
      objectLiteralDuplicateProperties: true, // Allow duplicate object literal properties (except '__proto__')
      generators: true, // enable parsing of generators/yield
      spread: true, // enable parsing spread operator
      superInFunctions: true, // enable super in functions
      classes: true, // enable parsing classes
      newTarget: false, // enable parsing of new.target
      modules: true, // enable parsing of modules
      jsx: true, // enable React JSX parsing
      globalReturn: true, // enable return in global scope
      experimentalObjectRestSpread: true // allow experimental object rest/spread
    }
  });
  var tokenStartMap = Object.create(null), tokenEndMap = Object.create(null);
  var locToKey = function(loc) {
    return loc.line + '-' + loc.column;
  };
  (function() {
    var lines = code.split(/\n/g);
    // slideFwd and slideBck skip over whitespace
    var slideFwd = function(loc) {
      loc = {line: loc.line, column: loc.column};
      while (loc.line <= lines.length) {
        var l = lines[loc.line - 1];
        var c = l[loc.column];
        if (!/[ \t\r\n]/.test(c)) break;
        loc.column++;
        if (loc.column >= l.length) { loc.column = 0; loc.line++; }
      }
      return loc;
    };
    var slideBck = function(loc) {
      loc = {line: loc.line, column: loc.column};
      while (loc.line >= 1) {
        var l = lines[loc.line - 1];
        var c = l[loc.column - 1];
        if (!/[ \t\r\n]/.test(c)) break;
        loc.column--;
        if (loc.column < 0) {
          loc.line--;
          loc.column = lines[loc.line - 1].length - 1;
        }
      }
      return loc;
    };
    ast.tokens.forEach(function(t) {
      tokenStartMap[locToKey(slideBck(t.loc.start))] = t;
      tokenEndMap[locToKey(slideFwd(t.loc.end))] = t;
    });
  })();

  var rootScope = scope.create(ast, scope.KIND_ROOT);
  function Emitter() {
    this.buffer = '';
    this.line = 1;
    this.insertionPoints = [];
    this.indentLevel = 0;
  }
  Emitter.prototype.toString = function() { return this.buffer; };
  Emitter.prototype.emit = function(str) {
    this.buffer += str;
  };
  Emitter.prototype.nl = function() {
    this.buffer = this.buffer.replace(/[ \t]+$/, '') + '\n';
    for (var i = 0; i < this.indentLevel; i++) {
      this.buffer += '\t';
    }
    this.line++;
  }
  Emitter.prototype.block = function(open, f, close) {
    var firstline = this.line;
    this.emit(open); this.emit(' ');
    var checkpoint = this.buffer.length;
    this.incrIndent();
    f();
    if (this.line > firstline) {
      this.ensureNl();
    } else if (this.buffer.length !== checkpoint) {
      this.emit(' ');
    } else {
      // no content in block => no space
      this.buffer = this.buffer.replace(/[\t ]+$/, '');
    }
    this.decrIndent();
    this.emit(close);
  };
  Emitter.prototype.incrIndent = function() {
    this.indentLevel++;
    if (/\t$/.test(this.buffer)) { this.emit('\t'); }
  }
  Emitter.prototype.decrIndent = function() {
    this.indentLevel--;
    if (/\t$/.test(this.buffer)) {
      this.buffer = this.buffer.slice(0, this.buffer.length - 1);
    }
  }
  Emitter.prototype.locStart = function(node) {
    if (node.leadingComments && node.leadingComments.length) {
      node.leadingComments.forEach(function(c) {
        this.emitComment(c);
      }, this);
    }
    if (node.type === 'Program') { return; }
    if (node && node.loc) {
      while (node.loc.start.line > this.line) {
        this.nl();
      }
      this.line = node.loc.start.line;
    }
    // Hack for preserving parentheses from the original
    if (!(node && node.suppressParens)) {
      var startT = node && node.loc && tokenEndMap[locToKey(node.loc.start)];
      var endT = node && node.loc && tokenStartMap[locToKey(node.loc.end)];
      if (
        node.forceParens ||
          (utils.isType(startT, 'Punctuator') && startT.value === '(' &&
           utils.isType(endT, 'Punctuator') && endT.value === ')')
      ) {
        this.emit('( ');
      }
    }
  };
  Emitter.prototype.locEnd = function(node) {
    // Hack for preserving parentheses from the original
    if (!(node && node.suppressParens)) {
      var startT = node && node.loc && tokenEndMap[locToKey(node.loc.start)];
      var endT = node && node.loc && tokenStartMap[locToKey(node.loc.end)];
      if (node.forceParens ||
          (utils.isType(startT, 'Punctuator') && startT.value === '(' &&
           utils.isType(endT, 'Punctuator') && endT.value === ')')
         ) {
        if (!this.endsInNl()) this.emit(' ');
        this.emit(')');
      }
    }
    if (node && node.loc) {
      while (node.loc.end.line > this.line) {
        this.nl();
      }
      this.line = node.loc.end.line;
    }
    if (node.trailingComments && node.trailingComments.length) {
      node.trailingComments.forEach(function(c) {
        this.emitComment(c);
      }, this);
    }
  };
  Emitter.prototype.emitComment = function(c) {
    if (c.emitted) { return; }
    this.locStart(c);
    if (c.type==='Block') {
      this.emit('/*');
      c.value.split(/\n/).forEach(function(l, idx) {
        if (idx > 0) { this.nl(); }
        this.emit(l.replace(/^\t+/, ''));
      }, this);
      this.emit('*/');
    } else {
      this.emit('//' + c.value); this.nl();
    }
    c.emitted = true;
  };
  Emitter.prototype.endsInNl = function() {
    return /\n[ \t]*$/.test(this.buffer);
  };
  Emitter.prototype.isSemiLast = function() {
    return this.buffer.match(/;\n?[ ]*$/);
  }
  Emitter.prototype.ensureSemi = function() {
    if (!emitter.isSemiLast()) { this.emit('; '); }
  };
  Emitter.prototype.ensureNl = function() {
    if (!this.endsInNl()) {
      this.nl();
    }
  };
  Emitter.prototype.replaceSemiWithComma = function() {
    this.buffer = this.buffer.replace(/;([ \t]*)$/, ', $1');
  };
  Emitter.prototype.pushInsertionPoint = function() {
    this.insertionPoints.push(this.buffer.length);
  }
  Emitter.prototype.popInsertionPoint = function() {
    this.insertionPoints.pop();
  }
  Emitter.prototype.insertAt = function(depth, str) {
    var idx = this.insertionPoints.length - depth - 1;
    var at = this.insertionPoints[idx];
    this.buffer = this.buffer.slice(0, at) + str + this.buffer.slice(at);
    while (++idx < this.insertionPoints.length) {
      this.insertionPoints[idx] += str.length;
    }
  }
  var emitter = new Emitter();
  if (options.indent) { emitter.indentLevel = options.indent; }

  function handleImport(parent, node) {
    node.declarations.forEach(function(d) {
      if (d.type !== 'VariableDeclarator') { return; }
      scope.get(parent).register(d);
      d.isImport = true;
      // the RHS is require('..some string..') but we're going to ignore that
      if (d.id.type === 'ObjectPattern') {
        emitter.locStart(d);
        d.id.properties.forEach(function(p, idx) {
          scope.get(parent).register({
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: p.value.name },
            isImport: true,
          });
          if (idx > 0) { emitter.nl(); }
          var name = utils.classize(p.key.name);
          if (options.namespace) { name = options.namespace + "\\" + name; }
          emitter.emit("use " + name);
          if (p.key.name !== p.value.name || options.namespace) {
            emitter.emit(" as " + utils.classize(p.value.name));
          }
          emitter.emit(";");
        });
        emitter.locEnd(d);
      } else if (d.id.type === 'Identifier') {
        var name = d.id.name;
        emitter.locStart(d);
        if (options.namespace) {
          emitter.emit(`use ${options.namespace}\\${name} as ${name};`);
        } else {
          emitter.emit(`use ${name};`);
        }
        emitter.locEnd(d);
      }
    });
  }

  function visit(node, parent) {
    var semicolon = false;

    // set parent node
    if (parent) { node.parent = parent; }
    if (!node.suppressLoc) { emitter.locStart(node); }

    if (utils.isType(node, /^(Program|BlockStatement|ClassBody)$/)) {
      // Skip strictness declaration
      if (utils.isType(node.body[0], 'ExpressionStatement') &&
          utils.isType(node.body[0].expression, 'Literal') &&
          node.body[0].expression.raw.match(/^["']use strict["']$/)) {
        emitter.locStart(node.body[0]); // flush leading comment
        node.body.shift();
      }
      if (node.type === 'Program') {
        if (options.namespace && !options.noOpenTag) {
          // Add optional namespace.
          emitter.emit(`namespace ${options.namespace};`);
          emitter.nl();
        }

        // skip core update require
        while (utils.isType(node.body[0], 'ExpressionStatement') &&
               utils.isType(node.body[0].expression, 'CallExpression') &&
               utils.isId(node.body[0].expression.callee, 'require')) {
          node.body.shift(); // discard this
        }

        // Look for require declarations
        while (utils.isType(node.body[0], 'VariableDeclaration') &&
               utils.isType(node.body[0].declarations[0], 'VariableDeclarator') &&
               utils.isType(node.body[0].declarations[0].init, 'CallExpression') &&
               utils.isId(node.body[0].declarations[0].init.callee, 'require')) {
          handleImport(node, node.body.shift());
        }
      }

      for (var i=0,length = node.body.length;i<length;i++) {
        visit(node.body[i], node);
      }

    } else if (node.type == "VariableDeclaration") {
      // declaration of one or multiple variables
      for (var i=0,length=node.declarations.length;i<length;i++) {
        visit(node.declarations[i], node);
      }

    } else if (node.type == "VariableDeclarator" && node.id.type === 'ObjectPattern') {
      var tmpName = scope.get(node).getTmpName();
      visit({
        type: 'VariableDeclarator',
        id: { type: 'Identifier', name: tmpName },
        init: node.init,
      }, node);
      node.id.properties.forEach(function(p) {
        visit({
          type: 'VariableDeclarator',
          id: p.value,
          init: {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: tmpName,
            },
            property: p.key,
          },
        }, node);
      });
    } else if (node.type == "VariableDeclarator") {
      scope.get(node).register(node);
      var isForStatement = node.parent &&
          utils.isType(node.parent.parent, /^For(In|Of|)Statement$/);
      if (isForStatement) { emitter.replaceSemiWithComma(); }

      // declaration of one variable
      emitter.emit('$' + node.id.name);

      if (node.init) {
        emitter.emit(' = ');
        visit(node.init, node);
        semicolon = true;
      } else if (!isForStatement || node.parent.parent==='ForStatement') {
        emitter.emit(' = null');
        semicolon = true;
      }

    } else if (utils.isId(node, "undefined")) {
      emitter.emit("null");
    } else if (node.type == "Identifier") {
      var identifier = (node.name || node.value);

      if (!node.static && !node.isCallee && !node.isMemberExpression) {
        var targetDefinition = scope.get(node).getDefinition(node);
        if (utils.isType(node.parent && node.parent.parent, "NewExpression") &&
            node.parent.callee === node) {
          emitter.emit(identifier);
        } else if (targetDefinition && targetDefinition.isImport) {
          emitter.emit(identifier + '::class');
        } else {
          emitter.emit('$' + identifier);
        }
      } else {
        emitter.emit(identifier);
      }

    } else if (node.type == "Punctuator") {
      emitter.emit(node.value);

    } else if (node.type == "Literal") {
      if (node.regex) {
        emitter.emit("/* RegExp */ " + utils.stringify(node.raw));
      } else if (typeof node.value === 'string' && node.value !== 'undefined') {
        emitter.emit(utils.stringify(node.value));
      } else {
        var value = (node.raw.match(/^["']undefined["']$/)) ? "NULL" : node.raw;
        emitter.emit(value);
      }
    } else if (node.type == "BinaryExpression" || node.type == "LogicalExpression") {

      if (node.operator == 'in') {
        visit({
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

        // test for two strings.
        var leftDefinition = scope.get(node).getDefinition(node.left);
        var rightDefinition = scope.get(node).getDefinition(node.right);

        if (leftDefinition && rightDefinition) {
          if (leftDefinition.type == "VariableDeclarator" && rightDefinition.type == "VariableDeclarator") {
            if (leftDefinition.init && utils.isString(leftDefinition.init) &&
                rightDefinition.init && utils.isString(rightDefinition.init)) {
              if (/\+/.test(node.operator)) {
                node.operator = node.operator.replace('+', '.');
                node.dataType = 'String';
              }
            }
          }
        }
        visit(node.left, node);
        emitter.emit(" ");
        emitter.pushInsertionPoint();
        emitter.emit(" ");
        emitter.incrIndent();
        visit(node.right, node);
        emitter.decrIndent();
        if (utils.isString(node.left) || utils.isString(node.right)) {
          if (/\+/.test(node.operator)) {
            node.operator = node.operator.replace('+', '.');
            node.dataType = 'String';
          }
        }
        emitter.insertAt(0, node.operator);
        emitter.popInsertionPoint();
      }

    } else if (node.type == "AssignmentExpression" && node.left.type == "ObjectPattern") {
      var tmpName = scope.get(node).getTmpName();
      var expressions = [
          {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'Identifier',
              name: tmpName,
            },
            right: node.right,
          },
      ];
      node.left.properties.forEach(function(p) {
        expressions.push({
          type: 'AssignmentExpression',
          operator: '=',
          left: p.value,
          right: {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: tmpName,
            },
            property: p.key,
          },
        });
      });
      // Don't return an assignment expression when visiting the sequence
      expressions.push({
        type: "Literal",
        value: null,
        raw: "null",
      });
      visit({
        type: 'SequenceExpression',
        expressions
      }, node);
    } else if (node.type == "AssignmentExpression" || node.type == "AssignmentPattern") {
      scope.get(node).register(node.left);

      visit(node.left, node);
      emitter.emit(" " + (node.operator || "=") + " ");
      visit(node.right, node);

    } else if (node.type == "ConditionalExpression") {
      emitter.block('(', function() {
        node.test.suppressParens = true;
        visit(node.test, node);
      }, ')');
      emitter.emit(' ? ');
      visit(node.consequent, node);
      emitter.emit(' : ');
      visit(node.alternate, node);

    } else if (node.type == "UnaryExpression") {

      // override typeof unary expression
      if (node.operator == 'typeof') {
        visit({
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'gettype',
          },
          arguments: [node.argument]
        }, node);

        // override delete unary expression
      } else if (node.operator == 'delete') {
        visit({
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'unset',
          },
          arguments: [node.argument]
        }, node);

      } else {
        emitter.emit(node.operator);
        visit(node.argument, node);
      }

    } else if (node.type == "ExpressionStatement") {
      if (node.expression.type === 'Literal' && node.expression.raw.match(/^["']use strict["']$/)) {
        // Ignore strictness declarations.
        return;
      }
      var iife = "";

      var isIIFE = (
        node.expression.type === "CallExpression" && (
          node.expression.callee.type === "FunctionExpression" ||
          node.expression.callee.type === "ArrowFunctionExpression"
        )
      );

      // IIFE
      if (isIIFE) {
        node.expression.isIIFE = true;
        node.expression.suppressParens = true;
        iife = "call_user_func( ";
      }

      emitter.emit(iife);
      visit(node.expression, node);
      semicolon = true;

    } else if (node.type == "CallExpression") {

      var calleeDefined = scope.get(node).getDefinition(node.callee);
      node = core.evaluate(node);

      node.callee.isCallee = (!calleeDefined || calleeDefined && (calleeDefined.type != "Identifier" &&
        calleeDefined.type != "VariableDeclarator"));

      if (node.parent && node.parent.arguments === false &&
          utils.isType(node.parent.parent, 'ExpressionStatement') &&
          utils.isId(node.callee, 'array_push') &&
          node.arguments.length === 2) {
        // Special case syntax
        visit(node.arguments[0], node);
        emitter.emit('[] = ');
        visit(node.arguments[1], node);
        emitter.locEnd(node);
        return;
      }

      if (node.callee.type === 'Super') {
        emitter.emit('parent::__construct');
      } else {
        visit(node.callee, node);
      }

      // inline anonymous call
      if (
        (node.callee.isCallee && node.callee.type == "FunctionDeclaration") ||
        node.type == "ArrowFunctionExpression"
      ) {
        var identifier = null;
        if (node.parent.type == "VariableDeclarator") {
          identifier = node.parent.id.name;

        } else if (node.parent.type == "AssignmentExpression") {
          identifier = node.parent.left.name;
        }
        if (!node.callee.isSequence) {
          emitter.emit(";");
          emitter.nl();
          emitter.emit("$" + identifier + " = " + "$" + identifier);
        }
      }

      if (node.arguments) {
        var arguments = [];

        emitter.block(
          node.isIIFE ? (node.arguments.length ? ',' : '') : '(', function() {
            for (var i=0, length = node.arguments.length; i < length; i++) {
              if (node.arguments.length===1) {
                node.arguments[i].suppressParens=true;
              }
              visit(node.arguments[i], node);
              if ((i+1) < length) { emitter.emit(', '); }
            }
          }, ')'
        );
      }

      // allow semicolon if parent node isn't MemberExpression or Property
      if (node.parent && node.parent.type == "ExpressionStatement") {
        semicolon = true;
      }

    } else if (node.type == "MemberExpression") {
      var newNode = core.evaluate(node);

      if (node != newNode) {
        // fix parent node type
        visit(newNode, node.parent);

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
        property.static = String(property.name || property.value || "").match(/^[A-Z]/);
        var targetDefinition = scope.get(node).getDefinition(object);
        if (
          node.object.type === 'Identifier' &&
          targetDefinition && targetDefinition.isImport
        ) {
          object.static = true;
        }

        var accessor;
        if (node.property.static && object.static) {
          accessor = "\\"; // namespace
        } else if ((property.static || object.static) || object.type == "Super") {
          accessor = "::"; // static
        } else {
          accessor = "->"; // instance
        }

        if (node.computed) {
          visit(node.object, node);
          emitter.block('[', function() {
            visit(node.property, node);
          }, ']');
        } else {
          node.property.isMemberExpression = true;
          visit(node.object, node);
          emitter.emit(accessor);
          visit(node.property, node);
        }
      }

    } else if (node.type == "FunctionDeclaration" ||
      node.type == "ArrowFunctionExpression") {
      var defaults = node.defaults || [];

      emitter.emit("function ");
      if (node.id) {
        if (typeof node.id.name === 'string') {
          emitter.emit(node.id.name);
        } else if (utils.isType(node.id.name, 'Identifier')) {
          // PHP doesn't support an identifier here, so suppress it.
          emitter.emit("/* " + node.id.name.name + " */");
        }
      }
      emitter.block('(', function() {

        // function declaration creates a new scope
        scope.create(node);

        // compute function params
        for (var i=0; i < node.params.length; i++) {
          if (defaults[i]) {
            visit({
              type: "BinaryExpression",
              left: node.params[i],
              operator: '=',
              right: defaults[i]
            }, node);
          } else {
            if (node.params.length===1) { node.params[i].suppressParens=true; }
            visit(node.params[i], node)
          }
          if ((i+1) < node.params.length) {
            emitter.emit(', ');
          }

          // register parameter identifiers
          if (scope.get(node).parent) {
            scope.get(node).register(node.params[i]);
          }
        }
      }, ')');
      emitter.emit(' ');
      emitter.pushInsertionPoint();
      emitter.emit('{');
      emitter.pushInsertionPoint();
      emitter.block('', function() {

        visit(node.body, node); /* function contents */
        var using = scope.get(node).using
            // XXX I don't understand why I have to do this:
            .filter(function(u) { return u!==undefined;});

        // try to use parent's variables
        // http://php.net/manual/pt_BR/functions.anonymous.php
        if (using.length > 0 &&
            !utils.isType(node.parent, /^(Program|MethodDefinition)$/)) {
          emitter.insertAt(1, "use ( " + using.map(function(identifier) {
            return "&$" + identifier;
          }).join(', ') + " ) ");
        }

        // workaround when scope doesn't allow to have the `use` keyword.
        if (node.parent.type === "Program") {
          emitter.insertAt(0, using.map(function(identifier) {
            return `\n\tglobal $${identifier};`;
          }).join(''));
        }

        if (node.expression) {
          // x => x * 2
          emitter.insertAt(0, 'return ');
          emitter.emit(';');
        }
      }, '}');
      emitter.popInsertionPoint();
      emitter.popInsertionPoint();

    } else if (node.type == "ObjectExpression") {
      emitter.block(useConciseArrays ? '[' : 'array(', function() {
        for (var i=0; i < node.properties.length; i++) {
          visit(node.properties[i], node);
          if ((i+1) < node.properties.length) { emitter.emit(', '); }
        }
      }, useConciseArrays ? ']' : ')');

    } else if (node.type == "ArrayExpression") {
      emitter.block(useConciseArrays ? '[' : 'array(', function() {
        for (var i=0; i < node.elements.length; i++) {
          visit(node.elements[i], node);
          if ((i+1) < node.elements.length) { emitter.emit(', '); }
        }
      }, useConciseArrays ? ']' : ')');

    } else if (node.type == "Property") {
      var property = (node.key.type == 'Identifier') ? node.key.name : node.key.value;
      if (typeof(property)==='string') { property = utils.stringify(property); }
      emitter.emit(String(property) + ' => ');
      visit(node.value, node);

    } else if (node.type == "ReturnStatement") {
      semicolon = true;
      emitter.emit('return');

      if (node.argument) {
        emitter.emit(' ');
        visit(node.argument, node);
      }

    } else if (node.type == "ClassDeclaration") {
      emitter.emit("class " + node.id.name + " ");

      if (node.superClass) {
        emitter.emit("extends " + node.superClass.name + " ");
      }

      var s = scope.create(node);
      emitter.emit('{'); emitter.incrIndent();
      visit(node.body, node);

      if (s.getters.length > 0) {
        emitter.emit("function __get($_property) ");
        emitter.block('{', function() {
          for (var i=0;i<s.getters.length;i++) {
            emitter.nl();
            emitter.emit("if ($_property === '"+s.getters[i].key.name+"') ");
            emitter.block('{', function() {
              visit(s.getters[i].value.body, node);
            }, '}');
          }
          emitter.nl();
        }, '}');
        emitter.nl();
      }

      if (s.setters.length > 0) {
        emitter.emit("function __set($_property, $value) ");
        emitter.block('{', function() {
          for (var i=0;i<s.setters.length;i++) {
            emitter.nl();
            emitter.emit("if ($_property === '"+s.setters[i].key.name+"') ");
            emitter.block('{', function() {
              visit(s.setters[i].value.body, node);
            }, '}');
          }
        }, '}');
        emitter.nl();
      }

      emitter.decrIndent();
      emitter.emit("}");


    } else if (node.type == "MethodDefinition") {
      scope.get(node).register(node);

      // define getters and setters on scope
      if (node.kind == "get" || node.kind == "set") {
        return;
      }

      var isConstructor = (node.key.name == "constructor");
      if (isConstructor) { node.key.name = "__construct"; }

      // Re-use FunctionDeclaration structure for method definitions
      node.value.type = "FunctionDeclaration";
      node.value.id = { name: node.key.name };

      // every method is public.
      emitter.emit("public ");
      if (node.static) { emitter.emit("static "); }
      visit(node.value, node);

      // try to define public properties there were defined on constructor
      if (isConstructor) {
        node.key.name = "__construct";
        var definitions = scope.get(node.value).definitions;
        for(var i in definitions) {
          if (definitions[i] && definitions[i].type == "MemberExpression") {
            definitions[i].property.isMemberExpression = false;
            emitter.nl();
            if (definitions[i].parent.type === 'AssignmentExpression' &&
                definitions[i].parent.parent.type==='ExpressionStatement') {
              var p = definitions[i].parent.parent;
              (p.leadingComments || []).forEach(function(c) {
                if (c.type === 'Block') { /* repeat property doc comments */
                  c.emitted=false;
                }
              });
              emitter.locStart(p);
             }
            emitter.emit('public ');
            definitions[i].property.suppressLoc = true;
            visit(definitions[i].property, null);
            emitter.emit("; ");
            //emitter.locEnd(definitions[i].property);
          }
        }
      }

    } else if (node.type == "ThisExpression") {
      emitter.emit("$this");

    } else if (node.type == "Super") {
      emitter.emit("parent");

    } else if (node.type == "IfStatement") {
      emitter.emit("if ");
      emitter.block('(', function() {
        node.test.suppressParens = true;
        visit(node.test, node);
      }, ')');
      emitter.emit(' ');
      emitter.block('{', function() {
        visit(node.consequent, node);
      }, '}');

      if (node.alternate) {
        emitter.emit(" else");
        if (utils.isType(node.alternate, "IfStatement") && !node.alternate.leadingComments) {
          /* suppress the space to create `elseif` token */
        } else {
          emitter.emit(" ");
        }

        if (utils.isType(node.alternate, "BlockStatement")) {
          emitter.block('{', function() {
            visit(node.alternate, node);
          }, '}');

        } else {
          visit(node.alternate, node)
        }
      }

    } else if (node.type == "SequenceExpression" && node.parent.type === 'ForStatement') {

      // PHP doesn't really have a true SequenceExpression (aka comma operator)
      // This version works iff the sequence expression is in a for loop:
      for (var i=0;i<node.expressions.length;i++) {
        visit(node.expressions[i], node);
        if ((i+1) < node.expressions.length) {
          emitter.emit(', ');
        }
      }

    } else if (node.type == "SequenceExpression") {
      // This is a completely general version
      visit({
        type: 'CallExpression',
        loc: node.loc,
        callee: {
          isSequence: true,
          forceParens: true,
          type: 'FunctionExpression',
          id: null,
          params: [],
          body: {
            type: 'BlockStatement',
            body: node.expressions.map(function(e, idx) {
              if (idx < node.expressions.length - 1) {
                return {
                  type: 'ExpressionStatement',
                  expression: e,
                };
              } else {
                return {
                  type: 'ReturnStatement',
                  argument: e,
                };
              }
            }),
          },
        },
        arguments: [],
      }, node);

    } else if (node.type == "WhileStatement") {

      emitter.emit("while ");
      emitter.block('(', function() { node.test.suppressParens = true; visit(node.test, node); }, ')');
      emitter.emit(' ');
      emitter.block('{', function() { visit(node.body, node); }, '}');

    } else if (node.type == "DoWhileStatement") {

      emitter.emit("do ");
      emitter.block('{', function() { visit(node.body, node); }, '}');
      emitter.emit(' while ');
      emitter.block('(', function() { node.test.suppressParens = true; visit(node.test, node); }, ')');
      semicolon = true;

    } else if (node.type == "ForStatement") {
      emitter.emit("for ");
      emitter.block('(', function() {
        if (node.init) { visit(node.init, node); }
        emitter.ensureSemi(); emitter.emit(' ');
        if (node.test) { visit(node.test, node); } else { emitter.emit('true'); }
        emitter.ensureSemi(); emitter.emit(' ');
        if (node.update) { visit(node.update, node); }
      }, ')');
      emitter.emit(' ');
      emitter.block('{', function() { visit(node.body, node); }, '}');

    } else if (node.type == "ForInStatement" || node.type == "ForOfStatement") {
      emitter.emit("foreach ");
      emitter.block('(', function() {
        visit(node.right, node);
        emitter.emit(" as ");
        visit(node.left, node);
        emitter.emit(" => $___");
      }, ')');
      emitter.emit(' ');
      emitter.block('{', function() { visit(node.body, node); }, '}');

    } else if (node.type == "UpdateExpression") {

      if (node.prefix) {
        emitter.emit(node.operator);
      }

      visit(node.argument, node);

      if (!node.prefix) {
        emitter.emit(node.operator);
      }

    } else if (node.type == "SwitchStatement") {
      emitter.emit("switch ");
      emitter.block('(', function() { node.discriminant.suppressParens = true; visit(node.discriminant, node); }, ')');
      emitter.emit(' ');
      emitter.block('{', function() {
        for (var i=0; i < node.cases.length; i++) {
          visit(node.cases[i], node); emitter.nl();
        }
      }, '}');

    } else if (node.type == "SwitchCase") {

      if (node.test) {
        emitter.emit("case ");
        visit(node.test, node);
        emitter.emit(":");
      } else {
        emitter.emit("default:");
      }
      emitter.nl();

      for (var i=0; i < node.consequent.length; i++) {
        visit(node.consequent[i], node);
      }

    } else if (node.type == "BreakStatement") {
      emitter.emit("break; ");

    } else if (node.type == "ContinueStatement") {
      emitter.emit("continue; ");

    } else if (node.type == "NewExpression") {
      // re-use CallExpression for NewExpression's
      var newNode = utils.clone(node);
      newNode.type = "CallExpression";
      newNode.suppressParens = true;

      emitter.emit('new ');
      visit(newNode, node);

    } else if (node.type == "FunctionExpression") {

      // Re-use FunctionDeclaration structure for method definitions
      node.type = "FunctionDeclaration";
      node.id = { name: node.id || "" };

      visit(node, node.parent);


      // Modules & Export (http://wiki.ecmascript.org/doku.php?id=harmony:modules_examples)
    } else if (node.type == "ModuleDeclaration") {
      emitter.emit("namespace " + utils.classize(node.id.value) + "; ");
      visit(node.body, node);

    } else if (node.type == "ExportNamedDeclaration") {
      visit(node.declaration, node);

    } else if (node.type == "ImportDeclaration") {
      for (var i=0,length = node.specifiers.length;i<length;i++) {
        visit(node.specifiers[i], node);
      }

    } else if (node.type == "ImportSpecifier") {
      var namespace = utils.classize(node.parent.source.value);
      emitter.emit("use \\" + namespace + "\\" + node.imported.name);

      // alias
      if (node.local) { emitter.emit(" as " + node.local.name); }

      emitter.emit(";\n");

    } else if (node.type == "TemplateLiteral") {
      var expressions = node.expressions
        , quasis = node.quasis
        , nodes = quasis.concat(expressions).sort(function(a, b) {
          return b.range[0] < a.range[0];
        })
        , cooked = "";

      emitter.emit('"');
      for (var i=0; i<nodes.length; i++) {
        if (nodes[i].type == "TemplateElement") {
          emitter.emit(utils.stringify(nodes[i].value.cooked, true).slice(1,-1));
        } else {
          emitter.emit('{');
          visit(nodes[i], node);
          emitter.emit('}');
        }
      }
      emitter.emit('"');

    } else if (node.type === "TryStatement") {
      emitter.emit("try ");
      emitter.block('{', function() { visit(node.block, node); }, '}');

      if (node.handler) {
        visit(node.handler, node);
      }

      if (node.finalizer) {
        emitter.emit(" finally ");
        emitter.block('{', function() { visit(node.finalizer, node); }, '}');
      }

    } else if (node.type === "CatchClause") {
      emitter.emit(' catch ( Exception ');
      scope.create(node.param, node);
      node.param.suppressParens = true;
      visit(node.param, node);
      emitter.emit(" ) ");
      emitter.block('{', function() { visit(node.body, node); }, '}');
    } else if (node.type === "ThrowStatement") {
      emitter.emit("throw ");
      visit(node.argument, node);
      semicolon = true;
    } else if (node.type === "RestElement") {
      emitter.emit('...');
      visit(node.argument, node);
    } else if (node.type === "SpreadElement") {
      emitter.emit('...');
      visit(node.argument, node);
    } else if (node.type === "YieldExpression") {
      // Parsoid-specific: ignore yield expression.
      emitter.emit("/* await */ ");
      visit(node.argument, node);
    } else if (node.type === 'EmptyStatement') {
      /* do nothing */
    } else {
      throw new Error("'" + node.type + "' not implemented: " + JSON.stringify(node.loc));
    }

    // append semicolon when required
    if (semicolon) {
      emitter.ensureSemi();
    }
    if (!node.suppressLoc) { emitter.locEnd(node); }
  }

  if (!options.noOpenTag) {
    emitter.emit("<?php\n");
  }
  if (options.watermark) {
    emitter.emit(`/* ${options.watermark} */\n`);
  }
  visit(ast);
  if (!options.noOpenTag) {
    emitter.ensureNl();
  }
  return emitter.toString().replace(/[ \t]+\n/g, '\n'); // remove trailing space
}
