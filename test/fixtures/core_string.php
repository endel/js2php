<?php
$str = "Hello";
echo(trim(trim(trim(substr(trim(trim("    trimmed    ")), 1)))));
var_dump(strtoupper(str_replace("lo", "ium", "hello")));
var_dump(strtoupper("something"));
var_dump(strpos("something", "meth"));
echo(ltrim("    trimmed"));
echo(rtrim("trimmed    "));
echo(substr(strtoupper($str), 1));
echo(strtolower($str));
echo(substr($str, 1));
$replace_stuff = 'say Hello';
echo(str_replace($str, 'Goodnight', $replace_stuff));
$replace_stuff2 = 'say Hello';
echo(str_replace('say', $str, $replace_stuff2));
$strArray = explode('ll', $str);
echo($strArray[0]);
$strArray2 = str_split($str);
echo($strArray2[0]);
if (preg_match('/endel/', $str)) {
var_dump($str);
}