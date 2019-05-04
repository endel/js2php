//
// Generate PHP from JS fixture files
//
var js2php = require('../index.js'),
    fs = require('fs'),
    fixturePath = './test/fixtures/',
    fixtures = fs.readdirSync(fixturePath),
    target = process.argv[2];

if (!target) {
  console.log("Usage:");
  console.log("");
  console.log("Generate PHP for all fixtures files:");
  console.log("\tnode test/generate.js all");
  console.log("");
  console.log("Generate PHP for single fixture file:");
  console.log("\tnode test/generate.js js_feature.js");

} else if (target.toLowerCase().trim() == "all") {
  target = /\.js$/;
} else {
  target = new RegExp(target + "$");
}

for(var i=0;i<fixtures.length;i++) {
  var file = fixturePath + fixtures[i],
      output = file.replace(/\.js$/, ".php"),
      options = {};

  if (file.match(/\.php$/)) {
    continue;
  }

  if (file.match(target)) {
    if (/namespaces_require\.js$/.test(file)) {
      options.namespace = 'NameTest';
    }
    try {
      fs.writeFileSync(output, js2php(fs.readFileSync(file, 'utf8'), options));
      console.log("OK: " + output);
    } catch (e) {
      console.log("FAILED: " + file + " => '" + e.message + "'", e.stack);
    }
  }
}

