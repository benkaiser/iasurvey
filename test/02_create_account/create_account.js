casper.test.begin('Test for login function', 7, function suite(test) {
  casper.start('http://localhost:2000/admin/login', function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'admin',
      'txtUserPwd': 'iaadminpass'
    }, false);
    //this.capture("xxx.png");
  });

  casper.then(function() {
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      this.capture("01_before_management.png");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[href="/admin/staff"]').thenClick('a[href="/admin/staff"]');
    this.wait(300, function() {
      this.capture("02_get_the_staff_management_page.png");
      test.assertUrlMatch("http://localhost:2000/admin/staff",
      "(1) Should be able to get the staff management page");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[href="/admin/staff/create"]').thenClick('a[href="/admin/staff/create"]');
    this.wait(300, function() {
      this.capture("03_get_the_account_create_page.png");
      test.assertUrlMatch("http://localhost:2000/admin/staff/create",
      "(2) Should be able to get the account create page");
    });
  });

  casper.then(function() {
    this.fill('div[class="form-group"]', {
      'uname': '',
      'password': '1234',
      'confirmPwd': '1234'
    }, false);
    this.click('input[name="isAdmin"]');
    this.wait(300, function() {
      this.capture("04_create_without_username.png");
    });
  });

  casper.then(function() {
    this.click('button[value="Create"]');
    this.wait(300, function() {
      test.assertUrlMatch("http://localhost:2000/admin/staff/create",
      "(3) Should not be able to create an account without username");
      this.capture("05_fail_with_no_username.png");
    });
  });

  casper.then(function() {
    this.fill('div[class="form-group"]', {
      'uname': 'tester',
      'password': '',
      'confirmPwd': '1234'
    }, false);
    this.click('input[name="isAdmin"]');
    this.wait(300, function() {
      this.capture("06_create_without_password.png");
    });
  });

    casper.then(function() {
      this.click('button[value="Create"]');
      this.wait(300, function() {
        test.assertUrlMatch("http://localhost:2000/admin/staff/create",
        "(4) Should not be able to create an account without password");
        this.capture("07_fail_with_no_password.png");
      });
    });

  casper.then(function() {
    this.fill('div[class="form-group"]', {
      'uname': 'tester',
      'password': '1234',
      'confirmPwd': ''
    }, false);
    this.click('input[name="isAdmin"]');
    this.wait(300, function() {
      this.capture("08_create_without_password_confirmed.png");
    });
  });

  casper.then(function() {
    this.click('button[value="Create"]');
    this.wait(300, function() {
      test.assertUrlMatch("http://localhost:2000/admin/staff/create",
      "(5) Should not be able to create an account without password confirmed");
      this.capture("09_fail_with_no_password_confirmed.png");
    });
  });

  casper.then(function() {
    this.fill('div[class="form-group"]', {
      'uname': 'admin',
      'password': '1234',
      'confirmPwd': '1234'
    }, false);
    this.click('input[name="isAdmin"]');
    this.wait(300, function() {
      this.capture("10_create_with_an_existing_username.png");
    });
  });

  casper.then(function() {
    this.click('button[value="Create"]');
    this.wait(300, function() {
      test.assertUrlMatch("http://localhost:2000/admin/staff/create",
      "(6) Should not be able to create an account with an existing username");
      this.capture("11_fail_with_an_existing_username.png");
    });
  });

  casper.then(function() {
    this.fill('div[class="form-group"]', {
      'uname': 'tester',
      'password': '1234',
      'confirmPwd': '1234'
    }, false);
    this.click('input[name="isAdmin"]');
    this.wait(300, function() {
      this.capture("12_input_a_valid_account_infor.png");
    });
  });

  casper.then(function() {
    this.click('button[value="Create"]');
    this.wait(300, function() {
      test.assertUrlMatch("http://localhost:2000/admin/staff",
      "(7) Should be able to create an account with enough info");
      this.capture("13_create_an_account_successfully.png");
    });
  });

  casper.run(function() {
        test.done();
    });
});
