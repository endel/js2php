<?php
$d = 10;
$closure = function ($a) use (&$d) {
$c = 1;
return function ($b) use (&$a, &$c, &$d) {
return $a + $b + $c + $d;
}
;
}
;
$calling = $closure(5);
var_dump($calling(4) == 20);
