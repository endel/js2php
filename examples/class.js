class ClassExample {

  constructor(something) {
    this._something = something
  }

  toArray(model, array) {
    return array;
  }

  hello() {
    return "Hello world";
  }

  // TODO: getter / setter methods
  // get something() {
  //   return "Something: " + this._something;
  // }

  creating(model) {
    Mail.send({
      body: Module.template('signup-confirmation').compile({
        base_url: AppConfig.get("retrieve.email.url")
      }),
      subject: "Sign-up confirmation",
      to: model.email,
      from: "somebody@example.com"
    });
  }

  updating(model) {
    if (model.isDirty('status') && model.status == 1) {

      Mail.send({
        body: Module.template('signup-approved').compile({
          BASE_URL: AppConfig.get("retrieve.email.url")
        }),
        subject: "Approved!",
        to: model.email,
        from: "somebody@example.com"
      });

    }
  }

}

// Instantiate class and call getter method
example = new ClassExample("awesome");
echo(example.hello())
