class KlassExample {

  toArray(model, array) {
    return array;
  }

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
