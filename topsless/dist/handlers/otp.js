"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.verify = exports.generate = void 0;
const crypto = __importStar(require("crypto"));
const OTPAuth = __importStar(require("otpauth"));
const hi_base32_1 = require("hi-base32");
const auth = __importStar(require("../service/auth"));
const generate = async (event) => {
    try {
        // const content = await request.json() as any;
        const guid = request.user.guid;
        const base32_secret = generateRandomBase32();
        let totp = new OTPAuth.TOTP({
            issuer: "auth.teemops.com",
            label: "teemops",
            algorithm: "SHA1",
            digits: 6,
            secret: base32_secret,
        });
        let otpauth_url = totp.toString();
        const newOtp = {
            guid: guid,
            otp_enabled: false,
            otp_verified: false,
            otp_ascii: "",
            otp_hex: "",
            otp_base32: base32_secret,
            otp_auth_url: otpauth_url
        };
        const result = await auth.add(env, newOtp);
        return {
            base32: base32_secret,
            otpauth_url: otpauth_url
        };
    }
    catch (e) {
    }
};
exports.generate = generate;
const verify = async (request, env) => {
    try {
        const content = await request.json();
        const guid = content.guid;
        const otp = content.otp;
        const result = await auth.get(env, guid);
        if (result != undefined) {
            const base32_secret = result.otp_base32;
            let totp = new OTPAuth.TOTP({
                issuer: "auth.teemops.com",
                label: "teemops",
                algorithm: "SHA1",
                digits: 6,
                secret: base32_secret,
            });
            const verified = totp.validate({
                token: otp,
                window: 1,
                time: Date.now(),
            });
            if (verified) {
                const newOtp = {
                    guid: guid,
                    otp_enabled: true,
                    otp_verified: true,
                    otp_ascii: "",
                    otp_hex: "",
                    otp_base32: base32_secret,
                    otp_auth_url: ""
                };
                const result = await auth.update(env, newOtp);
                return result;
            }
            else {
                return error(401, "Invalid OTP.");
            }
        }
        else {
            return error(404, "GUID not found.");
        }
    }
    catch (e) {
        throw e;
    }
};
exports.verify = verify;
const get = async (request, env) => {
    try {
        const content = await request.params;
        const guid = content.guid;
        if (!guid || guid != request.user.guid) {
            return error(401, "Access denied.");
        }
        else {
            const result = await auth.get(env, guid);
            if (result != undefined) {
                return result;
            }
            else {
                return error(404, "GUID not found.");
            }
        }
    }
    catch (e) {
        throw e;
    }
};
exports.get = get;
const generateRandomBase32 = () => {
    const buffer = crypto.randomBytes(15);
    const base32 = (0, hi_base32_1.encode)(buffer).replace(/=/g, "").substring(0, 24);
    return base32;
};
//# sourceMappingURL=otp.js.map