var jwt = require('jose');
var config = require('config-json');

module.exports = function () {
  return {
    /**
    * @author: Ben Fellows <ben@teemops.com>
    * @description: JWT.io token
    * Used in Authorization Header
    */
    createJWT: async function (payload) {

      try {
        const secret = new TextEncoder().encode(
          process.env.SECRET,
        )
        const alg = 'HS256'
        const token = await new jwt.SignJWT(payload)
          .setProtectedHeader({ alg })
          .setIssuedAt()
          .setIssuer('urn:teemops:issuer')
          .setAudience('urn:teemops:audience')
          .setExpirationTime('2h')
          .sign(secret)
        return token;
      } catch (e) {
        throw e;
      }
    },

    /**
    * @author: Ben Fellows <ben@teemops.com>
    * @description: JWT.io token
    * Verify
    */
    verifyJWT: async function (token) {
      try {
        config.load('./app/config/config.json');
        const secret = new TextEncoder().encode(
          process.env.SECRET,
        )
        var values = await jwt.jwtVerify(token, secret)
        var payload = values.payload
        return payload;
      } catch (e) {
        if (e.name != undefined) {
          switch (e.name) {
            case 'TokenExpiredError':
              throw {
                code: 401,
                message: `${e.message} Details: ${JSON.stringify(e)}`
              }
              break;
            default:
              throw e;
          }
        }
      }

    },

    /**
    * @author: Sarah Ruane <sarah@teem.nz>
    * @description: JWT.io refresh token
    * Refresh JWT - if a user is actively using our app we don't want the token to expire
    * This function takes a valid (and not expired) token and returns it with a new expiry date set
    */
    refreshJWT: async function (token, cb) {

      try {
        var originalPayload = await this.verifyJWT(token);

        var optionMapping = {
          iat: 'timestamp',
          exp: 'expiresIn',
          aud: 'audience',
          nbf: 'notBefore',
          iss: 'issuer',
          sub: 'subject',
          jti: 'jwtid',
          alg: 'algorithm'
        };

        var newPayload = {};

        //Copy values from original to new token
        for (var key in originalPayload) {
          if (Object.keys(optionMapping).indexOf(key) === -1) {
            newPayload[key] = originalPayload[key];
          }
        }

        var refreshedToken = await this.createJWT(newPayload);

        if (refreshedToken) {
          return { token: refreshedToken, success: true };
        }
        else {
          throw 'refresh-error';
        }
      }
      catch (err) {
        var errorMessage = err.name === 'TokenExpiredError' ? 'expired' : err.name;
        throw errorMessage;
      }
    }

  }
};
