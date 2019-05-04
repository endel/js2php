<?php
call_user_func( ( function ( $arg1 ) {
	var_dump( $arg1 );
	call_user_func( ( function ( $arg2 ) {
		var_dump( $arg2 );
	} ), 'world!' );
} ), 'Hello' );
