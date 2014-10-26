default:
	../js2php/node_modules/browserify/bin/cmd.js ../js2php/index.js -s js2php > ./js2php.js
	./node_modules/duo/bin/duo app.{js,css} -o build
