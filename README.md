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
PORT XXXX node app.js
```
where `XXXX` is the port number you wish to run the application on (defaults to 2000)

## Testing

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
- [Messenger](http://github.hubspot.com/messenger/) simple notification library for javascript

All other frameworks used are either part of the above, dependencies of the above or perform a function to trivial to mention.

## Other info

- [Javascript style-guide](https://github.com/airbnb/javascript)
- [How to use mongoexport](http://docs.mongodb.org/manual/reference/program/mongoexport/)
- [How to use mongoimport](http://docs.mongodb.org/manual/reference/program/mongoimport/)
