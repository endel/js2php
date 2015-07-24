class Page {
  read(name = "Page") {
    echo(`${name} read.\n`);
  }
}

class Article extends Page {
  read(name = "Article") {
    super.read(name);
  }
}

var article = new Article()
echo (article.read())
