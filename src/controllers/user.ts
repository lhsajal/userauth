import { RequestHandler } from 'express';
import * as types from '../customTypes/allTypes';
import { ApiResponseMessages } from '../util/apiResponseConstants';
import { ApiNamesConstants } from '../util/apiNamesConstants'
//const Schemas = require('../SchemaValidation/inviteUser');
import { inviteUserValidation, normalSignupValidation } from '../SchemaValidation/inviteUser';
import { emailInvite, createNewUser } from '../services/userService';
import Database from '../database/connection';
import * as mongoDB from "mongodb";
import { DbConstants } from '../database/dbConstants';

export const inviteUser: RequestHandler = async (req, res, next) => {
    loggerG.info(ApiNamesConstants.INVITE_USER);
    try {
        /*
                TODO: 
                1. Create email send api
            */
        const response: types.ApiResponse = {
            message: ApiResponseMessages.INVITE_NEW_USER, status: types.ApiStatusConstant.SUCCESS, data: {}
        };

        //validating the input first
        const validationResult = inviteUserValidation.validate(req.body);
        if (validationResult.error) {
            loggerG.error(ApiNamesConstants.INVITE_USER, validationResult);
            response["status"] = types.ApiStatusConstant.FAILED;
            response["message"] = { error: validationResult }
            return res.status(400).json(response);
        }

        const db: mongoDB.Db = await Database.get();
        const query = { email: req.body.email };
        const projection = { iStatus: 1 }
        const user = await db.collection(DbConstants.PANEL_USERS_COLLECTION).findOne(query, { projection });
        loggerG.info(ApiNamesConstants.INVITE_USER, { db: user })
        const iStatus: types.iStatus = user ? user!.iStatus : types.UserInvitedStatus.NONE;
        if (!user) {
            const prm1 = emailInvite(req.body.email);
            const newUserData = { ...req.body, iStatus: types.UserInvitedStatus.INVITED };
            const prm2 = createNewUser(newUserData);
            const finalPrm = await Promise.all([prm1, prm2]);
            loggerG.info(ApiNamesConstants.INVITE_USER, finalPrm);
        } else if (iStatus === types.UserInvitedStatus.INVITED) {
            const prm1 = await emailInvite(req.body.email);
            loggerG.info(ApiNamesConstants.INVITE_USER, prm1);
        } else {
            response["message"] = ApiResponseMessages.USER_SIGNED_UP_ALREADY;
            response["status"] = types.ApiStatusConstant.SUCCESS
        }
        return res.status(200).json(response);
    } catch (ex) {
        loggerG.error(ApiNamesConstants.INVITE_USER, ex);
        const response: types.ApiResponse = {
            message: { error: ex }, status: types.ApiStatusConstant.FAILED, data: {}
        };

        return res.status(400).json(response);
    }
};

export const verifyTokenController: RequestHandler = async (req, res, next) => {
    loggerG.info(ApiNamesConstants.VERIFY_TOKEN);
    try {
        const response: types.ApiResponse = {
            message: ApiResponseMessages.TOKEN_VERIFIED, status: types.ApiStatusConstant.SUCCESS, data: {}
        };
        return res.status(200).json(response);
    } catch (ex) {
        loggerG.error(ApiNamesConstants.VERIFY_TOKEN, ex);
        const response: types.ApiResponse = {
            message: { error: ex }, status: types.ApiStatusConstant.FAILED, data: {}
        };

        return res.status(400).json(response);
    }
};


export const normalSignupController: RequestHandler = async (req, res, next) => {
    loggerG.info(ApiNamesConstants.NORMAL_SIGNUP);
    try {
        /*
                TODO: 
                1. Create email send api
            */
        const response: types.ApiResponse = {
            message: ApiResponseMessages.USER_SIGNED_UP, status: types.ApiStatusConstant.SUCCESS, data: {}
        };

        //validating the input first
        const validationResult = normalSignupValidation.validate(req.body);
        if (validationResult.error) {
            loggerG.error(ApiNamesConstants.NORMAL_SIGNUP, validationResult);
            response["status"] = types.ApiStatusConstant.FAILED;
            response["message"] = { error: validationResult }
            return res.status(400).json(response);
        }

        //check if user has already signedup or not, if yes then we cannot signup again
        const db: mongoDB.Db = await Database.get();
        const query = { email: req.reqEmail };
        const projection = { iStatus: 1 }
        const user = await db.collection(DbConstants.PANEL_USERS_COLLECTION).findOne(query, { projection });
        loggerG.info(ApiNamesConstants.NORMAL_SIGNUP, { db: user })
        const iStatus: types.iStatus = user ? user!.iStatus : types.UserInvitedStatus.NONE;
        if (iStatus === types.UserInvitedStatus.ACCEPTED) {
            response["message"] = ApiResponseMessages.USER_SIGNED_UP_ALREADY;
            response["status"] = types.ApiStatusConstant.FAILED
            loggerG.info(ApiNamesConstants.NORMAL_SIGNUP, { message: ApiResponseMessages.USER_SIGNED_UP_ALREADY });
        } else if (!user) {
            response["message"] = ApiResponseMessages.USER_NOT_INVITED;
            response["status"] = types.ApiStatusConstant.FAILED
            loggerG.info(ApiNamesConstants.NORMAL_SIGNUP, { message: ApiResponseMessages.USER_NOT_INVITED });
        } else if (iStatus === types.UserInvitedStatus.INVITED) {
            const query = { email: req.reqEmail };
            const update = { $set: { iStatus: types.UserInvitedStatus.ACCEPTED } }
            await db.collection(DbConstants.PANEL_USERS_COLLECTION).findOneAndUpdate(query, update);
            response["message"] = ApiResponseMessages.USER_SIGNED_UP;
            response["status"] = types.ApiStatusConstant.SUCCESS
            loggerG.info(ApiNamesConstants.NORMAL_SIGNUP, { message: ApiResponseMessages.USER_SIGNED_UP });
        }

        return res.status(200).json(response);
    } catch (ex) {
        loggerG.error(ApiNamesConstants.NORMAL_SIGNUP, ex);
        const response: types.ApiResponse = {
            message: { error: ex }, status: types.ApiStatusConstant.FAILED, data: {}
        };

        return res.status(400).json(response);
    }
};
