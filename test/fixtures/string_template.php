<?php
$str1 = 'one';
$str2 = 'two';
$n1 = M_PI;
$n2 = 50;
$func = function () {
	return 'from function';
};


class Item {
	public function method() {
		return 'from method';
	}
}
$item = new Item();

echo( "{$str1}, {$str2}, {$n1}, {$n2}, {$item->method()}, {$func()}" );

echo( "funny characters like \" and \n should be fine {1 + 2}" );
