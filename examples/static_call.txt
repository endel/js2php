
Module.Http.Router.get('/send', function() {
  return this.json({
    success: Mail.send({
      body: Module.template('signup-confirmation').compile({
        base_url: AppConfig.get("retrieve.email.url")
      }),
      subject: "Sign-up confirmation",
      to: model.email,
      from: "somebody@example.com"
    })
  })
});
