import { D1QB, SelectOne, Insert } from "workers-qb";
import { IOtp } from "../types";

export async function add(otp: IOtp) {

    try {
        const db = new D1QB(env.DB);
        const check = await get(env, otp.guid);
        if (check != undefined) {
            const result = await db.insert({

                tableName: 'otp',
                data: {
                    ...otp
                }
            })
                .execute();
            return result;
        } else {
            throw new Error("GUID already exists.")
        }
    } catch (e) {
        throw e
    }

}

export async function update(env: Env, otp: IOtp) {
    try {
        const db = new D1QB(env.DB);
        const result = await db.update({
            tableName: 'otp',
            data: {
                ...otp
            },
            where: {
                conditions: `guid = '${otp.guid}'`
            }
        })
            .execute();
        return result;
    } catch (e) {
        throw e;
    }
}

/**
 * Gets unique guid hash of the contactid
 * 
 * @param DB 
 * @param id 
 * @returns 
 */
export async function get(env: Env, guid: string) {
    try {
        const db = new D1QB(env.DB);
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
    } catch (e) {
        throw e;
    }
}