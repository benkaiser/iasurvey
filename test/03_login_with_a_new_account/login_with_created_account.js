casper.test.begin('Test for login function', 3, function suite(test) {
  casper.start('http://localhost:2000/admin/login', function() {
    test.assertTitle("Admin - Interns Australia",
    "(1) Should be able to get the login page");
    this.capture("01_before_login.png");
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'tester',
      'txtUserPwd': '1234'
    }, false);
    this.capture("02_input_the_accont_created_just_now.png");
  });

  casper.then(function() {
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      this.capture("03_login_successful.png");
      test.assertTitle("Surveys - Interns Australia",
      "(2) Should be able to login with the account");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[href="/admin/login?logout"]').thenClick('a[href="/admin/login?logout"]');
    this.wait(300, function() {
      this.capture("04_logout_successful.png");
      test.assertTitle("Admin - Interns Australia",
      "(3) Should be able to logoff");
    });
  });

  casper.run(function() {
        test.done();
    });
});
