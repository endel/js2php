var str1 = "one"
  , str2 = "two"
  , n1 = Math.PI
  , n2 = 50
  , func = () => {
    return "from function"
  }


class Item {
  method () {
    return "from method";
  }
}
var item = new Item();

echo(`${str1}, ${str2}, ${n1}, ${n2}, ${ item.method() }, ${ func() }`)

echo(`funny characters like " and \n should be fine ${ 1 + 2 }`);
