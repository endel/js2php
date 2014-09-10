items = [1,2,3,4,5];

for (var i=0; i < items.length; i++) {
  var_dump(items[i]);
}

obj = {
  one: 'one',
  two: 'two',
  three: 'three'
}

for (var i in obj) {
  var_dump(i, obj[i]);
}

var j = 10
while (j > 0) {
  j--
  var_dump(j)
}
