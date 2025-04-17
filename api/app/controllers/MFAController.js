var axios = require('axios');

/**
 * Checks if MFA is enabled. If it is, then it will return true and the 
 * user will be prompted to enter their MFA code.
 * 
 * @param {*} token 
 * @returns 
 */
module.exports.check = async function (token) {
    try {
        const checkMFA = await axios.get(`${process.env.MFA_AUTH_API}generate`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        //if false is returned that means an OTP generation was attempted and failed.
        //because the user exists already in the mfa system.
        if (checkMFA.data.success == false) {
            return true
        } else {
            return false
        }
    } catch (e) {
        return false
    }
}

module.exports.validate = async function (token, otp) {
    try {
        const checkMFA = await axios.post(`${process.env.MFA_AUTH_API}validate`,
            {
                otp: otp
            }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },

        })
        //if false is returned that means an OTP generation was attempted and failed.
        //because the user exists already in the mfa system.
        if (checkMFA.data.success == true) {
            return true
        } else {
            return false
        }
    } catch (e) {
        if (e.response.status == 401) {
            return false
        } else {
            throw e
        }
    }
}