var string1 = "string1";
var string2 = "string2";
var string3 = string1 + string2;
var string4;

var_dump(string1+string2);

// Avoid a crash if/when one side of the operator is undefined at init
string4 = "later";
var_dump(string1+string4);
