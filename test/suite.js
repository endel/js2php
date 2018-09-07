var assert = require("assert"),
  fs = require('fs'),
  js2php = require('../index.js'),
  fixturesPath = './test/fixtures/',
  fixtures = fs.readdirSync(fixturesPath).filter(function (file) { return !file.match(/~$/) }),
  sources = [];

for (var i = 0; i < fixtures.length; i += 2) {
  sources.push([fixturesPath + fixtures[i], fixturesPath + fixtures[i + 1]])
}

describe('js2php', function () {
  for (var i = 0; i < sources.length; i++) {
    (function (i) {
      it(sources[i][0], function () {
        var js_source = fs.readFileSync(sources[i][0]).toString();
        var php_source = fs.readFileSync(sources[i][1]).toString().trim();

        assert.equal(js2php(js_source).trim(), php_source);
      })
    })(i)
  }
});
