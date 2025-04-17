const jwt = require('jsonwebtoken');

module.exports.readToken = getAuthToken
module.exports.authorize = authorizeLambda;
module.exports.verify = verifyJWT;
module.exports.getUser = getUserDetails;

function getAuthToken(headers) {
    if (headers.authorization) {
        return headers.Authorization.split(' ')[1];
    }
    return null;
}

function authorizeLambda(event, context) {
    try {
        const token = event.authorizationToken;
        const values = verifyJWT(token.split(' ')[1]);
        return generatePolicy(values.userid, 'Allow', event.methodArn);
    } catch (e) {
        return generatePolicy('user', 'Deny', event.methodArn);
    }
}

/**
 * 
 * @param {*} str 
 * @returns 
 */
function verifyJWT(str) {
    try {
        var secret = process.env.TOPS_SECRET;
        var values = jwt.verify(str, secret);
        return values;
    } catch (e) {
        if (e.name != undefined) {
            switch (e.name) {
                case 'TokenExpiredError':
                    throw {
                        code: 401,
                        message: `${e.message}`,
                        details: e
                    }
                    break;
                default:
                    throw e;
            }
        } else {
            throw e;
        }
    }
}

function generatePolicy(principalId, effect, resource) {
    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        var context = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        context = {
            org: "teemops",
            role: "admin",
            createdAt: new Date().getTime()
        }
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
}
//implement a function to get user details and principalid from lambda event field called requestContext
function getUserDetails(event) {

    try {
        var requestContext = event.requestContext;
        var authorizer = requestContext.authorizer;
        var principalId = authorizer.principalId;
        var claims = authorizer.claims;
        return {
            userid: principalId,
            claims: claims
        }
    } catch (e) {
        console.log(e)
        throw e
    }
}