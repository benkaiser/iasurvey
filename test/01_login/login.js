
casper.test.begin('Test for login function', 7, function suite(test) {
  casper.start('http://localhost:2000/admin/login', function() {
    test.assertTitle("Admin - Interns Australia",
    "(1) Should be able to get the login page");
    this.capture("01_before_login.png");
    this.fill('div[class="sign_in"]', {
      'txtUserName': '',
      'txtUserPwd': 'iaadminpass'
    }, false);
    this.capture("02_input_blank_username.png");
  });

  casper.then(function() {
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      test.assertTitle("Admin - Interns Australia",
      "(2) Should be not able to login without username");
      this.capture("03_login_fails_for_blank_username.png");
    });
  });

  casper.then(function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'admin',
      'txtUserPwd': ''
    }, false);
    this.capture("04_input_blank_password.png")
  });

  casper.then(function() {
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      test.assertTitle("Admin - Interns Australia",
      "(3) Should be not able to login without password");
      this.capture("05_login_fails_for_blank_password.png");
    });
  });

  casper.then(function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'admin123',
      'txtUserPwd': 'iaadminpass'
    }, false);
    this.capture("06_input_an_invalid_username.png")
  });

  casper.then(function() {
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      this.capture("07_login_fails_for_invalid_username.png");
      test.assertTitle("Admin - Interns Australia",
      "(4) Should be not able to login with an invalid username ");
    });
  });

  casper.then(function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'admin',
      'txtUserPwd': 'iaadminpass123'
    }, false);
    this.capture("08_input_a_wrong_password.png")
  });

  casper.then(function() {
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      this.capture("09_login_fails_for_wrong_password.png");
      test.assertTitle("Admin - Interns Australia",
      "(5) Should be not able to login with an invalid password");
    });
  });

  casper.then(function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'admin',
      'txtUserPwd': 'iaadminpass'
    }, false);
    this.capture("10_input_admin_username_and_password.png")
  });

  casper.then(function() {
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      this.capture("11_login_successful.png");
      test.assertTitle("Surveys - Interns Australia",
      "(6) Should be able to login with a valid account");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[href="/admin/login?logout"]').thenClick('a[href="/admin/login?logout"]');
    this.wait(300, function() {
      this.capture("12_logout_successful.png");
      test.assertTitle("Admin - Interns Australia",
      "(7) Should be able to logoff");
    });
  });

  casper.run(function() {
        test.done();
    });
});
