export interface IEnv {
    DB: D1Database
}

export interface IOtp {
    id?: number
    guid: string
    otp_enabled: boolean
    otp_verified: boolean
    otp_ascii?: string
    otp_hex?: string
    otp_base32?: string
    otp_auth_url?: string
}