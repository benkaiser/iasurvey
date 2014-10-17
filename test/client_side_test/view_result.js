var envVars = require('system').env;
var BUrl = 'http://localhost:' + (envVars.PORT || 2000);

casper.test.begin('Test for viewing a result \n# (Pic) means there Should be a screenshot for the chart under to confirm"/test/client_side_test"', 12, function suite(test) {

  casper.start(BUrl+'/admin/login', function() {
    this.fill('div[class="sign_in"]', {
      'txtUserName': 'admin',
      'txtUserPwd': 'iaadminpass'
    }, false);
    this.click('button[id="btnSub"]');
    this.wait(300, function() {
      this.click('a[id="resultButton"]');
    });
  });

  casper.then(function() {
    this.click('a[href="/admin/results/541acea580382a3a562ccfc7"]');
    this.wait(300, function() {
      test.assertUrlMatch(BUrl+"/admin/results/541acea580382a3a562ccfc7",
      "(1) Should be able to get the result view page");
      });
  });

  casper.then(function() {
    this.click('div[id="show_all"]');
    this.wait(300, function() {
      test.assertElementCount('tr', 4,
      "(2) Should show all the result for the sample survey");
      });
  });

  casper.then(function() {
    this.click('div[id="chart"]');
    this.wait(300, function() {
      test.assertTextExists('Charts',
      "(3) Should show charts for the data in the table (Pic)");
      this.capture("01_after_click_Chart_button.png");
      });
  });

  casper.then(function() {
    this.wait(300, function() {
      this.click('div[id="piechart"]')
      });
    this.wait(300, function() {
      test.assertTextExists('33.3%',
      "(4) Should show piechart after hit the Piechart button (Pic)");
    });
    this.wait(300, function() {
      this.capture("02_Pie_charts.png", {
        top: 700,
        left: 0,
        width: 400,
        height: 1400
      });
    });
  });

  casper.then(function() {
    this.wait(300, function() {
      this.click('div[id="barchart"]')
      });
    this.wait(300, function() {
      test.assertTextExists('Charts',
      "(5) Should show barchart after hit the Barchart button (Pic)");
    });
    this.wait(300, function() {
      this.capture("03_Bar_charts.png", {
        top: 700,
        left: 0,
        width: 400,
        height: 1400
      });
    });
  });

  casper.then(function() {
    this.wait(300, function() {
      this.click('div[id="columnchart"]')
      });
    this.wait(300, function() {
      test.assertTextExists('Charts',
      "(6) Should show columnchart after hit the Columnchart button (Pic)");
    });
    this.wait(300, function() {
      this.capture("04_Collumn_charts.png", {
        top: 700,
        left: 0,
        width: 400,
        height: 1400
      });
    });
  });

  casper.then(function() {
    this.fill('form[id="query_container"]', {
      '0d': 'a',
    }, false);
    this.wait(300, function() {
      this.click('div[id="query"]')
      });
    this.wait(300, function() {
      test.assertElementCount('tr', 3,
      "(7) Should be able to list the result of query with the use of '='");
      });
  });

  casper.then(function() {
    this.click('div[id="add_query"]')
    this.wait(300, function() {
      this.fill('form[id="query_container"]', {
        '1d': '5',
      }, false);
      this.evaluate(function() {
          document.querySelector('select[name="1b"]').selectedIndex = 5;
      });
      this.click('div[id="query"]')
    });
    this.wait(300, function() {
      test.assertElementCount('tr', 2,
      "(8) Should be able to list the result of query with the use of '=' and 'AND'");
      });
  });

  casper.then(function() {
      this.evaluate(function() {
          document.querySelector('select[name="1c"]').selectedIndex = 1;
      });
      this.click('div[id="query"]')
    this.wait(300, function() {
      test.assertElementCount('tr', 2,
      "(9) Should be able to list the result of query with the use of '!='");
      });
  });

  casper.then(function() {
      this.evaluate(function() {
          document.querySelector('select[name="1c"]').selectedIndex = 2;
      });
      this.click('div[id="query"]')
    this.wait(300, function() {
      test.assertElementCount('tr', 2,
      "(10) Should be able to list the result of query with the use of '>'");
      });
  });

  casper.then(function() {
      this.evaluate(function() {
          document.querySelector('select[name="1c"]').selectedIndex = 3;
      });
      this.click('div[id="query"]')
    this.wait(300, function() {
      test.assertElementCount('tr', 1,
      "(11) Should be able to list the result of query with the use of '<'");
      });
  });

  casper.then(function() {
    this.wait(300, function() {
      this.fill('form[id="query_container"]', {
        '1d': 'b',
      }, false);
      this.evaluate(function() {
          document.querySelector('select[name="1a"]').selectedIndex = 1;
          document.querySelector('select[name="1b"]').selectedIndex = 0;
          document.querySelector('select[name="1c"]').selectedIndex = 0;
      });
      this.click('div[id="query"]')
    });
    this.wait(300, function() {
      test.assertElementCount('tr', 4,
      "(12) Should be able to list the result of query with the use of 'OR'");
      });
  });

  casper.run(function() {
        test.done();
    });
});
