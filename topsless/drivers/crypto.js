const secret = process.env.CRYPTO_SECRET
const userSecret = process.env.CRYPTO_USER
const crypto = require('crypto')
const crypt = require('crypto-js')

module.exports = async function generate() {
    const key = crypto.createHash("sha256").update(crypto.randomBytes(50)).digest()
    const generated = crypt.SHA256(key.toString('ascii'), secret).toString()
    return generated
}