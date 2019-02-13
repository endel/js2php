<?php
class ClassExample {

	public function __construct( $something ) {
		$this->_something = $something;
	}
	public $_something;


	public function toArray( $model, $array ) {
		return $array;
	}

	public function hello() {
		return 'Hello world';
	}









	public function creating( $model ) {
		Mail::send( [
				'body' => Module::template( 'signup-confirmation' )->compile( [
						'base_url' => AppConfig::get( 'retrieve.email.url' )
					]
				),
				'subject' => 'Sign-up confirmation',
				'to' => $model->email,
				'from' => 'somebody@example.com'
			]
		);
	}

	public function updating( $model ) {
		if ( $model->isDirty( 'status' ) && $model->status == 1 ) {

			Mail::send( [
					'body' => Module::template( 'signup-approved' )->compile( [
							'BASE_URL' => AppConfig::get( 'retrieve.email.url' )
						]
					),
					'subject' => 'Approved!',
					'to' => $model->email,
					'from' => 'somebody@example.com'
				]
			);

		}
	}

	function __get($_property) {
		if ($_property === 'something') {
			return 'Something: ' . $this->_something;
			 }
		 }
	function __set($_property, $value) {
		if ($_property === 'something') {
			$this->_something = $value + 10;
		}
	}
}



























// Instantiate class and call getter method
$example = new ClassExample( 'awesome' );
var_dump( call_user_func_array( [ $example, 'hello' ], [] ) );
var_dump( $example->hello() );

$c = ( new ClassExample( 'cool' ) )->hello();
