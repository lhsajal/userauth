import { sendEmail } from './emailService';
import Database from '../database/connection';
import * as mongoDB from "mongodb";
import { DbConstants } from '../database/dbConstants';
import { ApiNamesConstants } from '../util/apiNamesConstants'
import {getToken} from '../middlewares/tokenService';

export async function emailInvite(email: string) {
    const token = await getToken({email});
    console.log(`token emailInvite `, token);
    //construct email here
    /*
    */
    return await sendEmail();
}

export async function createNewUser(uData: object) {
    const db: mongoDB.Db = await Database.get();
    const result = db.collection(DbConstants.PANEL_USERS_COLLECTION).insertOne(uData);
    loggerG.info(ApiNamesConstants.INVITE_USER, result)
    return result
}

export async function passwordResetEmail(email: string) {
    const token = await getToken({email});
    console.log(`token emailInvite `, token);
    //construct email here
    /*
    */
    return await sendEmail();
}
