<?php
class Page
{

}
class Article extends Page
{
public $name;
public function __construct($name) {
$this->name = $name;
}

}
$article = new Article("Wonderful article");
var_dump($article->name);
