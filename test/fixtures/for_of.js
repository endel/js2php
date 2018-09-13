var items = [
  { name: "one" },
  { name: "two" },
  { name: "three" }
]

for (item of items) {
  echo(item['name'])
  continue
}
