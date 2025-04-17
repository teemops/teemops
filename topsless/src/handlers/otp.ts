import { IOtp } from '../types';
import * as crypto from 'crypto';
import * as OTPAuth from "otpauth";
import { encode } from "hi-base32";
import * as auth from '../service/auth';

export const generate: any = async (event: any) => {
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

		const newOtp: IOtp = {
			guid: guid,
			otp_enabled: false,
			otp_verified: false,
			otp_ascii: "",
			otp_hex: "",
			otp_base32: base32_secret,
			otp_auth_url: otpauth_url
		}
		const result = await auth.add(env, newOtp);
		return {
			base32: base32_secret,
			otpauth_url: otpauth_url
		};
	} catch (e) {

	}
};

export const verify: RouteHandler = async (request: IRequest, env: Env) => {
	try {
		const content = await request.json() as any;
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
				const newOtp: IOtp = {
					guid: guid,
					otp_enabled: true,
					otp_verified: true,
					otp_ascii: "",
					otp_hex: "",
					otp_base32: base32_secret,
					otp_auth_url: ""
				}
				const result = await auth.update(env, newOtp);
				return result;
			} else {
				return error(401, "Invalid OTP.");
			}
		} else {
			return error(404, "GUID not found.");
		}
	} catch (e) {
		throw e;
	}
}

export const get = async (request: IRequest, env: Env) => {
	try {
		const content = await request.params as any;
		const guid = content.guid;
		if (!guid || guid != request.user.guid) {
			return error(401, "Access denied.");
		} else {
			const result = await auth.get(env, guid);
			if (result != undefined) {
				return result;
			} else {
				return error(404, "GUID not found.");
			}
		}
	} catch (e) {
		throw e;
	}

}

const generateRandomBase32 = () => {
	const buffer = crypto.randomBytes(15);
	const base32 = encode(buffer).replace(/=/g, "").substring(0, 24);
	return base32;
};
