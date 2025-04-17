
var regionData = require("../../app/data/regions.json");
var bodyParser = require('body-parser');
var express = require('express');

var router = express.Router();

router.use(bodyParser.json());

router.get('/ht', async function (req, res) {
    //log out ALB load baaalancer if is the one requesting HT
    console.log(req.headers['user-agent']);
    console.log(req.headers['x-forwarded-for']);
    console.log(req.headers['x-forwarded-proto']);
    console.log(req.headers['x-forwarded-port']);
    console.log(req.headers['x-forwarded-host']);
    console.log('Health Check Requested')
    res.json({
        status: 'ok'
    });
});

router.get('/regions', async function (req, res) {
    res.json(regionData);
});

module.exports = router;
