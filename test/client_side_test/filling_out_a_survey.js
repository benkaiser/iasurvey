var envVars = require('system').env;
var BUrl = 'http://localhost:' + (envVars.PORT || 2000);

casper.test.begin('Test for fulling out a survey', 18, function suite(test) {

  casper.start(BUrl, function() {
    this.wait(300, function() {
      test.assertTitle("Surveys - Interns Australia",
      "(1) Should be able to get the survey page");
    });
  });

  casper.then(function() {
    this.wait(300, function() {
      this.click('a[href="/survey/541acea580382a3a562ccfc7"]');
    });
    this.wait(300, function() {
      test.assertTextExists('Every Question Type',
      "(2) Should be able to view a test");
    });
  });

  casper.then(function() {
    this.fill('form[id="current_form"]', {
      'input_c2': 'test for textbox',
      'input_c6': 'test for paragraph'
    }, false);
    this.click('div[id="next"]');
    this.wait(300, function() {
      test.assertTextExists('Radio?',
      "(3) Should not allow continue when the required radio is blank");
    });
  });

  casper.then(function() {
    this.fill('form[id="current_form"]', {
      'input_c2': '',
      'input_c6': 'test for paragraph'
    }, false);
    this.click('input[value="Op1 (R)"]');
    this.click('div[id="next"]');
    this.wait(300, function() {
      //this.capture("sss.png");
      test.assertTextExists('Text?',
      "(4) Should not allow user continue when the required textbox is blank");
    });
  });

  casper.then(function() {
    this.fill('form[id="current_form"]', {
      'input_c2': 'test for textbox',
      'input_c6': ''
    }, false);
    this.click('div[id="next"]');
    this.wait(300, function() {
      test.assertTextExists('Paragraph?',
      "(5) Should not allow user continue when the required paragraph is blank");
    });
  });

  casper.then(function() {
    this.fill('form[id="current_form"]', {
      'input_c2': 'a',
      'input_c6': 'test for paragraph'
    }, false);
    this.click('input[value="Op2 (C)"]');
    this.click('input[value="Op3 (C)"]');
    this.click('div[id="next"]');
    this.wait(300, function() {
      test.assertTextExists('Checkbox?',
      "(6) Should not allow user continue when the required checkbox is blank");
    });
  });

  casper.then(function() {
    this.click('input[value="Op3 (C)"]');
    this.evaluate(function() {
        document.querySelector('select[id="input_c25"]').selectedIndex = 0;
    });
    this.click('div[id="next"]');
    this.wait(300, function() {
      test.assertTextExists('Number?',
      "(7) Should allow user continue when the required questions is answered");
    });
  });

  casper.then(function() {
    this.click('div[id="prev"]');
    this.wait(300, function() {
      test.assertTextExists('Text?',
      "(8) Should be able to return to the last page with the button");
    });
    this.click('div[id="next"]');
  });

  casper.then(function() {
    this.fill('div[id="surveyContainer"]', {
      'input_c27': 'a string not time'
    }, false);
    this.wait(300, function() {
      test.assertTextDoesntExist('a string not time',
      "(9) Should not accept invalid characters input for time picker");
      test.assertField('input_c27', '1:00 AM',
      '(10) And should change the invalid input to an initial time for time picker )');
    });
  });

  casper.then(function() {
    this.fill('div[id="surveyContainer"]', {
      'input_c27': '12:61'
    }, false);
    this.wait(300, function() {
      test.assertTextDoesntExist('12:61',
      "(11) Should not accept an impossible time for time picker");
      test.assertField('input_c27', '12:59 AM',
      '(12) and should change the impossbile input to an acceptable one for time picker)');
    });
  });

  casper.then(function() {
    this.fill('div[id="surveyContainer"]', {
      'input_c27': '12:30 AM'
    }, false);
    this.click('div[id="next"]');
    this.wait(300, function() {
      test.assertField('input_c27', '12:30 AM',
      '(13) Should accept a valid time for time picker)');
    });
  });

  casper.then(function() {
    this.fill('div[id="surveyContainer"]', {
      'input_c23': '29-10-2014'
    }, false);
    this.wait(300, function() {
      test.assertField('input_c23', '29-10-2014',
      '(14) Should accept a valid time for date picker)');
    });
  });

  casper.then(function() {
    this.fill('div[id="surveyContainer"]', {
      'input_c33': 'abc',
    }, false);
    this.click('div[id="next"]');
    this.wait(300, function() {
      test.assertTextExists('Number?',
      "(15) Should not allow user continue when number textbox is filled with invalid characters");
    });
  });

  casper.then(function() {
    this.fill('div[id="surveyContainer"]', {
      'input_c33': '',
    }, false);
    this.click('div[id="next"]');
    this.wait(300, function() {
      test.assertTextExists('Number?',
      "(16) Should not allow user continue when required number textbox is blank");
    });
  });

  casper.then(function() {
    this.fill('div[id="surveyContainer"]', {
      'input_c33': '12',
      'input_c27': ''
    }, false);
    this.click('div[id="next"]');
    this.wait(300, function() {
      test.assertTextExists('Number?',
      "(17) Should not allow user continue when required time is blank");
    });
  });

  casper.then(function() {
    this.fill('div[id="surveyContainer"]', {
      'input_c33': '5',
      'input_c23': '',
      'input_c27': '11:20 PM'
    }, false);
    this.click('div[id="next"]');
    this.wait(300, function() {
      test.assertTextExists('Congratulations!',
      "(18) Should allow user continue when required questions are answered and optional ones are blank");
    });
  });

  casper.run(function() {
        test.done();
    });
});
