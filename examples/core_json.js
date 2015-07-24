JSON.stringify({
  integer: 5,
  string: "hey",
  nested: {objects:{here: "yey"}}
});

var_dump(JSON.stringify({
  integer: 5,
  string: "hey",
  nested: { objects: { here: "yey" } }
}));

