<?php
call_user_func(function () {
var_dump("Hello");
call_user_func(function () {
var_dump("world!");
}
, []);
}
, []);
