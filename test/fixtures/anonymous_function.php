<?php
$inline = function ($i) {
return $i;
}
(5);
var_dump($inline);
$assignment = null;
$assignment = function () {
$_results = array(1, 2, 3, 4, 5);
return $_results;
}
();
var_dump($assignment);

