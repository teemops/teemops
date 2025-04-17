"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.update = exports.add = void 0;
const workers_qb_1 = require("workers-qb");
async function add(otp) {
    try {
        const db = new workers_qb_1.D1QB(env.DB);
        const check = await get(env, otp.guid);
        if (check != undefined) {
            const result = await db.insert({
                tableName: 'otp',
                data: Object.assign({}, otp)
            })
                .execute();
            return result;
        }
        else {
            throw new Error("GUID already exists.");
        }
    }
    catch (e) {
        throw e;
    }
}
exports.add = add;
async function update(env, otp) {
    try {
        const db = new workers_qb_1.D1QB(env.DB);
        const result = await db.update({
            tableName: 'otp',
            data: Object.assign({}, otp),
            where: {
                conditions: `guid = '${otp.guid}'`
            }
        })
            .execute();
        return result;
    }
    catch (e) {
        throw e;
    }
}
exports.update = update;
/**
 * Gets unique guid hash of the contactid
 *
 * @param DB
 * @param id
 * @returns
 */
async function get(env, guid) {
    try {
        const db = new workers_qb_1.D1QB(env.DB);
        //let { results } = await env.DB.prepare(`SELECT * FROM otp WHERE guid = ?`).bind(guid).all();
        const { results } = await db.fetchOne({
            tableName: 'otp',
            fields: ['*'],
            where: {
                conditions: `guid = '${guid}'`
            },
        })
            .execute();
        return results;
    }
    catch (e) {
        throw e;
    }
}
exports.get = get;
//# sourceMappingURL=auth.js.map