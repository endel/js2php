<?php
class Page
{
public function read($name = "Page") {
echo("{$name} read.
");
}

}
class Article extends Page
{
public function read($name = "Article") {
parent::read($name);
}

}
$article = new Article();
echo($article->read());
