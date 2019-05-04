<?php
$start = time();
doSomethingExpensive();
$end = time();
var_dump( $end - $start );
