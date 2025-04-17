/* global $ */
// server.js

// BASE SETUP
// =============================================================================
const PUBLIC_ROUTES = ['/api/users', '/api/pricing', '/api/data', '/subscribe'];

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var Users = require('./app/views/users.js');
var Apps = require('./app/views/apps.js');
var AppStatus = require('./app/views/appstatus.js');
var Credentials = require('./app/views/credentials.js');
var Token = require('./app/views/token.js');
var UserCloudProviders = require('./app/views/usercloudproviders.js');
var UserCloudConfigs = require('./app/views/usercloudconfigs.js');
var Pricing = require('./app/views/pricing.js');
var Data = require('./app/views/data.js');

var config = require('config-json');
var sse = require('./app/drivers/sse.js');
var clientList = require('./app/models/clientList.js');
var setup = require("./app/controllers/SetupController.js");
var security = require('./app/security/index');

config.load('./app/config/config.json');
function setAWSProfile() {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    //returns json with credentials

    const cmd = 'aws configure export-credentials --profile opsadmin';
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      //get json values from output
      const json = JSON.parse(stdout);
      //set environment variables
      process.env.AWS_ACCESS_KEY_ID = json.AccessKeyId;
      process.env.AWS_SECRET_ACCESS_KEY = json.SecretAccessKey;
      process.env.AWS_SESSION_TOKEN = json.SessionToken;
      resolve();
    });
  });
}

// Start function
const startSetup = async function () {
  try {
    if (process.env.MODE == 'dev') {
      console.log('Setting up AWS profile');
      //await setAWSProfile();
    }
    const setupResult = await setup.init(config);
    if (setupResult) {
      console.log('Setup completed succesfully... initialising app');
    } else {
      console.log('Error with setup, please check setup instructions and AWS credentials.');
      process.exit(1);
    }
  } catch (e) {
    console.log(e)
  }

}

//CHECK SETUP STUFF
// Call start
startSetup().then(function () {
  config.load('./app/config/config.json');
  // configure app to use bodyParser()
  // this will let us get the data from a POST
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  //var jwtauth = require('./controllers/AuthController.js');

  app.param('userid', function (req, res, next, id) {
    console.log('CALLED ONLY ONCE' + id);
    next()
  });
  app.all('/*', async function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,Authorization');

    if (req.method == 'OPTIONS') {
      res.status(200).end();
    } else {

      const path = req.path;
      console.log("Path: " + path);

      const match = PUBLIC_ROUTES.find(
        route => (path.indexOf(route) == 0)
      );

      if (match !== undefined) {
        next();
      } else {
        try {
          const allowed = await security(req, path);
          if (allowed) {
            next();
          } else {
            throw {
              code: 400,
              message: 'Bad request - not allowed'
            }
          }
        } catch (e) {
          if (e.code == undefined) {
            e.code = 500;
          } else {
            res.status(e.code);
          }
          res.json({ error: e });
          res.end();
        }
      }

    }
  });



  var port = process.env.PORT || 8080;        // set our port

  // ROUTES FOR OUR API
  // =============================================================================
  var router = express.Router();              // get an instance of the express Router

  // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
  router.get('/', function (req, res) {
    res.json({ message: 'To use our API please read our docs at http://docs.teemops.com/api' });
  });

  app.use('/api/users', Users);
  app.use('/api/apps', Apps);
  app.use('/api/appstatus', AppStatus);
  app.use('/api/credentials', Credentials);
  app.use('/api/token', Token);
  app.use('/api/usercloudproviders', UserCloudProviders);
  app.use('/api/usercloudconfigs', UserCloudConfigs);
  app.use('/api/pricing', Pricing);
  app.use('/api/data', Data);

  // more routes for our API will happen here

  // REGISTER OUR ROUTES -------------------------------
  // all of our routes will be prefixed with /api
  app.use('/api', router);


  // Handle list of clients subscribing to app changes
  app.use(sse);
  app.get('/subscribe/:userId?', function (req, res) {

    console.log('Subscription request received for userId ' + req.params.userId);

    res.sseSetup();
    var token = req.query['x-access-token'];
    clientList.addClient(req.params.userId, token, res);

    req.on("close", function () {
      console.log('Closing client: ' + req.params.userId + ', ' + token);
      clientList.removeClient(req.params.userId, token);
    });
  });
  //error handling
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    if (err.code != undefined) {
      res.status(err.code).json({ error: err.message });
    } else {
      res.status(500).json(err);
    }
  })


  // START THE SERVER
  // =============================================================================
  app.listen(port);
  console.log('Listening on port ' + port);
});



