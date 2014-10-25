<?php
Module\Http\Router::get('/send', function () {
return $this->json(array("success" => Mail::send(array("body" => Module::template('signup-confirmation')->compile(array("base_url" => AppConfig::get("retrieve.email.url"))), "subject" => "Sign-up confirmation", "to" => $model->email, "from" => "somebody@example.com"))));
}
);
