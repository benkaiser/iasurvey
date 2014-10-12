casper.test.begin('Test for login function', 2, function suite(test) {
  casper.start('http://localhost:2000/admin/login', function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'admin',
      'txtUserPwd': 'iaadminpass'
    }, false);
    //this.capture("000.png");
  });

  casper.then(function() {
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      //this.capture("001.png");
    });
  });

  casper.then(function() {
    this.waitForSelector('a[href="/admin/staff"]').thenClick('a[href="/admin/staff"]');
    this.wait(300, function() {
      this.capture("01_before_delete.png");
      test.assertUrlMatch("http://localhost:2000/admin/staff",
      "(1) Should be able to get the staff management page");
    });
  });

  casper.then(function() {
    this.click('a[name="testerD"]');
    this.wait(300, function() {
      test.assertDoesntExist('a[name="testerD"]',
      "(2) Should not be able to find the account deleted");
      this.capture("02_after_delete.png");
    });
  });

  casper.run(function() {
        test.done();
    });
});
