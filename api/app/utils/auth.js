var jwtController = require("../../app/controllers/JWTController.js");
var myJWT = jwtController();

module.exports = async function (req, res, next) {

    try {
        var token = req.headers['x-access-token'];
        var jwtValues = await myJWT.verifyJWT(token);

        if (jwtValues) {
            req.auth_userid = jwtValues.userid;
            console.log("This is the success of getting token" + req.auth_userid);
            next();
        } else {
            console.log("This is the failure of getting token");
            res.json({ err: "No token provided or unauthorised." });
        }
    } catch (e) {
        console.log(e);

        res.status(401).json({ err: "Token expired or unauthorized." });
    }


};
