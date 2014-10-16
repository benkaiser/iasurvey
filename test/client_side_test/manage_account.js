var BUrl = 'http://localhost:2000';

casper.test.begin('Test for account management', 33, function suite(test) {

  casper.start(BUrl+'/admin/login', function() {
    test.assertTitle("Admin - Interns Australia",
    "(1) Should be able to get the login page");
  });

  casper.then(function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': '',
      'txtUserPwd': 'iaadminpass'
    }, false);
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      test.assertTextExists('User name can not be empty.',
      "(2) Should be not able to login when the username is empty");
    });
  });

  casper.then(function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'admin',
      'txtUserPwd': ''
    }, false);
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      test.assertTextExists('Password can not be empty.',
      "(3) Should be not able to login when the password is empty");
    });
  });

  casper.then(function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'admin123',
      'txtUserPwd': 'iaadminpass'
    }, false);
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      test.assertTextExists('User does not exist!',
      "(4) Should be not able to login with a username doesn't exist");
    });
  });

  casper.then(function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'admin',
      'txtUserPwd': 'iaadminpass123'
    }, false);
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      test.assertTextExists('Username or password invalid!',
      "(5) Should be not able to login with a wrong password");
    });
  });

  casper.then(function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'admin',
      'txtUserPwd': 'iaadminpass'
    }, false);
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin",
      "(6) Should be able to login with a valid account and its password");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[ID="staffButton"]').thenClick('a[ID="staffButton"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/staff",
      "(7) Should be able to get the staff management page with the button");
    });
  });

  casper.thenOpen(BUrl+'/admin', function() {
    this.click('a[id="staLi"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/staff",
      "(8) Should be able to get the staff management page with the header link");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[href="/admin/staff/create"]').thenClick('a[href="/admin/staff/create"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/staff/create",
      "(9) Should be able to get the account creating page with the link");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[id="backButton"]').thenClick('a[id="backButton"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/staff",
      "(10) Should be able to get back to the staff management page with the button");
    });
    this.waitForSelector('a[href="/admin/staff/create"]').thenClick('a[href="/admin/staff/create"]');
  });

  casper.then(function() {
    this.fill('div[class="form-group"]', {
      'uname': '',
      'password': '1234',
      'confirmPwd': '1234'
    }, false);
    this.click('input[name="isAdmin"]');
    this.click('button[value="Create"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/staff/create",
      "(11) Should not be able to create an account when the username is empty and stay in account creating page");
    });
  });

  casper.then(function() {
    this.fill('div[class="form-group"]', {
      'uname': 'tester',
      'password': '',
      'confirmPwd': '1234'
    }, false);
    this.click('input[name="isAdmin"]');
    this.click('button[value="Create"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/staff/create",
      "(12) Should not be able to create an account when the password is empty and stay in account creating page");
    });
  });

  casper.then(function() {
    this.fill('div[class="form-group"]', {
      'uname': 'tester',
      'password': '1234',
      'confirmPwd': ''
    }, false);
    this.click('input[name="isAdmin"]');
    this.click('button[value="Create"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/staff/create",
      "(13) Should not be able to create an account without password confirmed and stay in account creating page");
    });
  });

  casper.then(function() {
    this.fill('div[class="form-group"]', {
      'uname': 'admin',
      'password': '1234',
      'confirmPwd': '1234'
    }, false);
    this.click('input[name="isAdmin"]');
    this.click('button[value="Create"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/staff/create",
      "(14) Should not be able to create an account with an existing username and stay in account creating page");
    });
  });

  casper.then(function() {
    this.fill('div[class="form-group"]', {
      'uname': 'tester1',
      'password': '1234',
      'confirmPwd': '1234'
    }, false);
    this.click('input[name="isAdmin"]');
    this.click('button[value="Create"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/staff",
      "(15) Should be able to create an account with enough info (tester1 is an admin)");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[href="/admin/login?logout"]').thenClick('a[href="/admin/login?logout"]');
    this.wait(300, function() {
      test.assertTitle("Admin - Interns Australia",
      "(16) Should be able to logoff");
    });
  });

  casper.then(function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'tester1',
      'txtUserPwd': '1234'
    }, false);
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin",
      "(17) Should be able to login with the new account");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[href="/admin/staff"]').thenClick('a[href="/admin/staff"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/staff",
      "(18) Should be able to get the staff management page with the header");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[name="tester1E"]').thenClick('a[name="tester1E"]');
    this.wait(300, function() {
    test.assertExists('input[value="tester1"]',
    "(19) Should be able to get the staff management page for 'tester1'");
    });
  });

  casper.then(function() {
    this.fill('div[class="edit_user"]', {
      'password': '12345',
      'confirmPwd': ''
    }, false);
    this.click('button[id="updateBtn"]');
    this.wait(300, function() {
      test.assertTitle("Account Update - Interns Australia",
      "(20) Should not be able to update an account without confirm");
    });
  });

  casper.then(function() {
    this.fill('div[class="edit_user"]', {
      'password': '',
      'confirmPwd': '12345'
    }, false);
    this.click('button[id="updateBtn"]');
    this.wait(300, function() {
      test.assertTitle("Account Update - Interns Australia",
      "(21) Should not be able to update an account without password");
    });
  });

  casper.then(function() {
    this.fill('div[class="edit_user"]', {
      'password': '12345',
      'confirmPwd': '12345'
    }, false);
    this.click('input[name="isAdmin"]');
    this.click('button[id="updateBtn"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/staff",
      "(22) Should be able to change the password and admin state of an existing account");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[href="/admin/login?logout"]').thenClick('a[href="/admin/login?logout"]');
    this.wait(300, function() {
      this.fill('div[class="sign_in"]', {
        'txtUserName': 'tester1',
        'txtUserPwd': '12345'
      }, false);
    });
  });

  casper.then(function() {
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin",
      "(23) Should be able to login with new password");
      test.assertDoesntExist('a[id="staffButton"]',
      "(24) Should not display staff management button to a normal user");
    });
  });

  casper.then(function() {
    this.click('a[href="/admin/password-update"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/password-update",
      "(25) Should be able to get the change password page");
    });
    this.wait(300, function() {
      this.click('a[id="btnBack"]')
      test.assertUrlMatch(BUrl+"/admin",
      "(26) Should be able to get back with the back button");
    });
  });

  //右上角的改密码（未完成）
  casper.then(function() {
    this.click('a[href="/admin/password-update"]');
    this.wait(300, function() {
      this.fill('form[id="pwform"]', {
        'oldpw': '',
        'newpw': '1234',
        'confirmpw': '1234'
      }, false);
      this.click('button[value="Submit"]');
    });
    this.wait(300, function() {
      test.assertTextExists('Please enter the correct old password',
      "(27) Should not be able to change password with the old password blank");
    })
  });

  casper.then(function() {
    this.click('a[href="/admin"]');
    this.waitForSelector('a[id="surveyButton"]').thenClick('a[id="surveyButton"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/surveys",
      "(2n) Should be able to get survey management page with the button");
    });
  });

  casper.then(function() {
    this.click('a[href="/admin"]');
    this.waitForSelector('a[id="surLi"]').thenClick('a[id="surLi"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/surveys",
      "(2n) Should be able to get survey management page with the header link");
    });
  });

  casper.then(function() {
    this.click('a[href="/admin/surveys/create"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/surveys",
      "(2n) Should be able to get survey create page");
    });
  });

  casper.then(function() {
    this.click('a[href="/admin"]');
    this.waitForSelector('a[id="resultButton"]').thenClick('a[id="resultButton"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/results",
      "(2n) Should be able to get survey results page with the button");
    });
  });

  casper.then(function() {
    this.click('a[href="/admin"]');
    this.waitForSelector('a[id="resLi"]').thenClick('a[id="resLi"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/results",
      "(2n) Should be able to get survey results page with the  header link");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[href="/admin/login?logout"]').thenClick('a[href="/admin/login?logout"]');
    this.wait(300, function() {
      this.fill('div[class="sign_in"]', {
        'txtUserName': 'admin',
        'txtUserPwd': 'iaadminpass'
      }, false);
      this.click('button[id="btnSub"]');
    });
    this.waitForSelector('a[href="/admin/staff"]').thenClick('a[href="/admin/staff"]');
  });

  casper.then(function() {
    this.waitForSelector('a[name="tester1D"]').thenClick('a[name="tester1D"]');
    this.wait(300, function() {
      test.assertDoesntExist('a[name="tester1D"]',
      "(2n) Should not be able to find the account deleted");
    });
  });

  casper.run(function() {
        test.done();
    });
});
