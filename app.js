var CodeMirror = require('codemirror/CodeMirror:lib/codemirror.js');
require('codemirror/CodeMirror:mode/php/php.js');
require('codemirror/CodeMirror:mode/javascript/javascript.js');

window.jQuery = require('jquery/jquery:dist/jquery.js');
window.$ = jQuery;
require('twbs/bootstrap:dist/js/bootstrap.js');

var js2php = require('./js2php.js');

$(function() {
  var javascriptEditor = CodeMirror.fromTextArea(document.getElementById("javascript"), {
    mode: 'javascript',
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true
  });

  var phpEditor = CodeMirror.fromTextArea(document.getElementById("php"), {
    mode: 'php',
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true
  });

  var convert = function() { phpEditor.setValue( js2php(javascriptEditor.getValue()) ); }
  javascriptEditor.on('change', convert);
  javascriptEditor.on('keyup', convert);
  convert();

  // create examples
  var examples = [
    'class.js',
    'class_inheritance.js',
    'anonymous_function.js',
    'arrow_functions.js',
    'closures.js',
    'conditionals.js',
    'core_array.js',
    'core_function.js',
    'core_json.js',
    'core_math.js',
    'core_string.js',
    'date.js',
    'expression.js',
    'for_of.js',
    'function.js',
    'function_super.js',
    'loops.js',
    'namespaces.js',
    'namespaces_use.js',
    'regexp.js',
    'simple.js',
    'static_call.js',
    'string_template.js',
  ];

  for(var i=0;i<examples.length;i++) {
    $('ul.dropdown-menu').append('<li><a href="#">'+examples[i].replace(".js", "")+'</a></li>');
  }

  $('ul.dropdown-menu').on('click', 'a', function(e) {
    e.preventDefault();
    var example = $(this).text();
    $.get('examples/' + example + '.js', function(text) {
      javascriptEditor.setValue(text);
    });
  });

  $('ul.dropdown-menu a:first').click();

})
