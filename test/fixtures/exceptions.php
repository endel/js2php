<?php
throw new Exception("doh!");
try {
echo("hello");
} catch (Exception $e) {
var_dump($e);
}
try {
throw new Exception("The sky is falling!");
} finally {
var_dump("All clear");
}

