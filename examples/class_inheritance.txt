class Page { }
class Article extends Page {
  constructor(name) {
    this.name = name;
  }
}

var article = new Article("Wonderful article");
var_dump(article.name);
