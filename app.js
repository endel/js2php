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
  var examples = ['class.txt', 'closures.txt', 'conditionals.txt', 'core_array.txt', 'core_function.txt', 'core_json.txt', 'core_math.txt', 'core_string.txt', 'expression.txt', 'function.txt', 'loops.txt', 'namespaces.txt', 'namespaces_use.txt', 'simple.txt', 'static_call.txt'];
  for(var i=0;i<examples.length;i++) {
    $('ul.dropdown-menu').append('<li><a href="#">'+examples[i].replace(".txt", "")+'</a></li>');
  }

  $('ul.dropdown-menu').on('click', 'a', function(e) {
    e.preventDefault();
    var example = $(this).text();
    $.get('examples/' + example + '.txt', function(text) {
      javascriptEditor.setValue(text);
    });
  });

  $('ul.dropdown-menu a:first').click();

})
