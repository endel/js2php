<?php
class Page
{
public $title;
public $body;
public function __construct($title, $body) {
$this->title = $title;
$this->body = $body;
}
public function getDescription() {
return "{$this->title}: {$this->body}";
}

}
class Article extends Page
{
public $author;
public function __construct($title, $body, $author) {
parent::__construct($title, $body);
$this->author = $author;
}
public function getDescription() {
$descrition = $parent->getDescription();
return "{$description} by {$this->author}";
}

}
$article = new Article("Wonderful article", "Yada Yada Yada", "Bob Loblaw");
var_dump($article->getDescription());

