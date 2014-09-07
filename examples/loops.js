items = [1,2,3,4,5];

for (var i=0; i < items.length; i++) {
  console.log(items[i]);
}

obj = {
  one: 'one',
  two: 'two',
  three: 'three'
}

for (var i in obj) {
  var_dump(i, obj[i]);
}
