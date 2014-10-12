casper.test.begin('Test for login function', 6, function suite(test) {
  casper.start('http://localhost:2000/admin/login', function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'tester',
      'txtUserPwd': '1234'
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
    this.click('a[name="testerE"]');
    this.wait(300, function() {
      test.assertTitle("Account Update - Interns Australia",
      "(2) Should be able to get the update page");
      this.capture("03_get_the_update_page_for_an_account.png");
    });
  });

  casper.then(function() {
    this.fill('div[class="edit_user"]', {
      'password': '12345',
      'confirmPwd': ''
    }, false);
    this.wait(300, function() {
      this.capture("04_input_without_confirm.png");
    });
  });

  casper.then(function() {
    this.click('button[id="updateBtn"]');
    this.wait(300, function() {
      this.capture("05_fail_to_update_for_confirm.png");
      test.assertTitle("Account Update - Interns Australia",
      "(3) Should not be able to update an account without confirm");
    });
  });

  casper.then(function() {
    this.fill('div[class="edit_user"]', {
      'password': '',
      'confirmPwd': '12345'
    }, false);
    this.wait(300, function() {
      this.capture("06_input_without_password.png");
    });
  });

  casper.then(function() {
    this.click('button[id="updateBtn"]');
    this.wait(300, function() {
      this.capture("07_fail_to_update_for_confirm.png");
      test.assertTitle("Account Update - Interns Australia",
      "(4) Should not be able to update an account without password");
    });
  });

  casper.then(function() {
    this.fill('div[class="edit_user"]', {
      'password': '12345',
      'confirmPwd': '12345'
    }, false);
    this.wait(300, function() {
      this.capture("08_input_password_and_confirm.png");
    });
  });

  casper.then(function() {
    this.click('input[name="isAdmin"]');
    this.wait(300, function() {
      this.capture("09_change_the_admin_state.png");
    });
  });

  casper.then(function() {
    this.click('button[id="updateBtn"]');
    this.wait(300, function() {
      this.capture("10_update_complete.png");
      test.assertTitle("Manage Staff - Interns Australia",
      "(5) Should be able to update an account with password and confirm");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[href="/admin/login?logout"]').thenClick('a[href="/admin/login?logout"]');
    this.wait(300, function() {
      this.capture("11_logout.png");
    });
  });

  casper.then(function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'tester',
      'txtUserPwd': '12345'
    }, false);
    this.capture("12_input_new_password.png")
  });

  casper.then(function() {
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      test.assertTitle("Surveys - Interns Australia",
      "(6) Should be able to login with new password");
      this.capture("13_login_with_new_password.png");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[href="/admin/login?logout"]').thenClick('a[href="/admin/login?logout"]');
    this.wait(300, function() {
      //this.capture("000.png");
    });
  });

  casper.then(function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'admin',
      'txtUserPwd': 'iaadminpass'
    }, false);
    //this.capture("001.png")
  });

  casper.then(function() {
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      //this.capture("002.png");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[href="/admin/staff"]').thenClick('a[href="/admin/staff"]');
    this.wait(300, function() {
      //this.capture("111.png");
    });
  });

  casper.then(function() {
    this.click('a[name="testerE"]');
    this.wait(300, function() {
      //this.capture("222.png");
    });
  });

  casper.then(function() {
    this.fill('div[class="edit_user"]', {
      'password': '1234',
      'confirmPwd': '1234'
    }, false);
    this.click('input[name="isAdmin"]');
    this.wait(300, function() {
      //this.capture("333.png");
    });
  });

  casper.then(function() {
    this.click('button[id="updateBtn"]');
    this.wait(300, function() {
      //this.capture("444.png");
    });
  });

  casper.run(function() {
        test.done();
    });
});
