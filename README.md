# IA Survey System

## Installation

Dependencies:
- [Node.js](http://nodejs.org/)
- [git](http://git-scm.com/)
- [MongoDB](http://www.mongodb.org/)

Installing the project:
```
git clone https://benkaiser@bitbucket.org/benkaiser/iasurvey.git # clone the repo
cd iasurvey # move into the repository directory
npm install # install the dependencies of the project
```

## Usage

To run the server:
```
PORT=XXXX node app.js
```
where `XXXX` is the port number you wish to run the application on (defaults to 2000)

## Unit Testing

To run the tests you will first need to install mocha with:
```
npm install -g mocha
```
Installing modules globally usually requires superuser permissions. In this case run:
```
sudo npm install -g mocha
```

Then to run the tests (located in the `test/` directory)
```
mocha
```

## Integration Testing

To run the integration tests on windows 7 x64, you need to download and install
```
phantomjs 1.9.7
casperjs 1.1.0-beta3
python 2.7.8
```
And import the data from json file when it is needed.

(1) To run the test for account management function, direct to `test/client_side_test` and run:
```
casperjs test manage_account.js
```
If you cancel the test during the program is running, please delete the account created by the test program, so that the test program can work again

(2) To run the test for filling out a survey, direct to `data/surveys` and enter to import the data first:
```
mongoimport -d iasurvey -c survey every_question_type.json
```
Then direct to `test/client_side_test` and run:
```
casperjs test filling_out_a_survey.js
```
(3) To run the test for viewing the result of surveys, you need to drop the data you have now and import one from a json file
Open Mongodb and enter:
```
use iasurvey
db.result.drop()
```
Then, run the command in `data/result` to import the result data:
```
mongoimport -d iasurvey -c survey tresult.json
```
At last, locate in `test/client_side_test`, enter:
```
casperjs test view_result.js
```
## Documentation for libraries used

Server-side

- [express](http://expressjs.com/) for web framework
- [mongojs](https://github.com/mafintosh/mongojs) for database connectivity
- [connect-mongo](https://github.com/kcbanner/connect-mongo) for storing express sessions in mongodb (keeping session data between server restarts)
- [node-schedule](https://github.com/mattpat/node-schedule) for scheduling email blasts
- [nodemailer](https://github.com/andris9/Nodemailer) for sending emails
- [password-hash](https://github.com/davidwood/node-password-hash) for encrypting passwords
- [socket.io](https://github.com/Automattic/socket.io) for easy websocket connections (making for a fast and easy to develop client-side app)
- [swig](http://paularmstrong.github.io/swig/docs/) templating engine for node and javascript (server-side and client-side)
- [supertest](https://github.com/visionmedia/supertest) for testing calls to webpages

Client-side

- [formbuilder](https://github.com/dobtco/formbuilder) for the IA staff to construct surveys ([Ben's fork](https://github.com/benkaiser/formbuilder))
- [backbone.js](http://backbonejs.org/) for client-side MVC
- [marionette](http://marionettejs.com/) for extra functionality on top of backbone.js
- [jquery](http://jquery.com/) fast, small, and feature-rich javascript library that makes DOM-traversal easy
- [Bootstrap](http://getbootstrap.com/) as a good-looking CSS framework
- [head.js](http://headjs.com/) load css and js asynchronously, speeding up page-load
- [sift.js](https://github.com/crcn/sift.js) for querying the results array
- [html5csv](https://github.com/DrPaulBrewer/html5csv) for generating and triggering the csv download from the results page
- [phantomjs](http://phantomjs.org) for integration testing environment
- [casperjs](http://casperjs.org) for runing the integration testing programs

All other frameworks used are either part of the above, dependencies of the above or perform a function to trivial to mention.

## Other info

- [Javascript style-guide](https://github.com/airbnb/javascript)
- [How to use mongoexport](http://docs.mongodb.org/manual/reference/program/mongoexport/)
- [How to use mongoimport](http://docs.mongodb.org/manual/reference/program/mongoimport/)
