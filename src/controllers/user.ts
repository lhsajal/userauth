import { RequestHandler } from 'express';
import * as types from '../customTypes/allTypes';
import { ApiResponseMessages } from '../util/apiResponseConstants';
import { ApiNamesConstants } from '../util/apiNamesConstants'
import schemas from '../SchemaValidation/inviteUser';
import userServices from '../services/userService';
import Database from '../database/connection';
import * as mongoDB from "mongodb";
import { DbConstants } from '../database/dbConstants';
import bcrypt from 'bcrypt';
import { SALTROUNDS } from '../util/projectConstants';
import tokenServices from '../middlewares/tokenService';

namespace userControllerServices {
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
            const validationResult = schemas.inviteUserValidation.validate(req.body);
            if (validationResult.error) {
                loggerG.error(ApiNamesConstants.INVITE_USER, validationResult);
                response["status"] = types.ApiStatusConstant.FAILED;
                response["message"] = { error: validationResult }
                return res.status(400).json(response);
            }

            const { email } = req.body;

            const db: mongoDB.Db = await Database.get();
            const query = { email };
            const projection = { iStatus: 1 }
            const user = await db.collection(DbConstants.PANEL_USERS_COLLECTION).findOne(query, { projection });
            loggerG.info(ApiNamesConstants.INVITE_USER, { db: user })
            const iStatus: types.iStatus = user ? user!.iStatus : types.UserInvitedStatus.NONE;
            if (!user) {
                const prm1 = userServices.emailInvite(email);
                const newUserData = { ...req.body, iStatus: types.UserInvitedStatus.INVITED };
                const prm2 = userServices.createNewUser(newUserData);
                const finalPrm = await Promise.all([prm1, prm2]);
                loggerG.info(ApiNamesConstants.INVITE_USER, finalPrm);
            } else if (iStatus === types.UserInvitedStatus.INVITED) {
                const prm1 = await userServices.emailInvite(email);
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

            const email = req.reqEmail;
            const { password } = req.body;
            //validating the input first
            const validationResult = schemas.normalSignupValidation.validate(req.body);
            if (validationResult.error) {
                loggerG.error(ApiNamesConstants.NORMAL_SIGNUP, validationResult);
                response["status"] = types.ApiStatusConstant.FAILED;
                response["message"] = { error: validationResult }
                return res.status(400).json(response);
            }

            //check if user has already signedup or not, if yes then we cannot signup again
            const db: mongoDB.Db = await Database.get();
            const query = { email };
            const user = await db.collection(DbConstants.PANEL_USERS_COLLECTION).findOne(query);
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
                const query = { email };
                const hashedPassword = await bcrypt.hash(password, SALTROUNDS)
                const update = { $set: { iStatus: types.UserInvitedStatus.ACCEPTED, password: hashedPassword } }
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

    export const passwordResetEmailSendController: RequestHandler = async (req, res, next) => {
        loggerG.info(ApiNamesConstants.SEND_PASSWORD_RESET_LINK);
        try {
            /*
                    TODO: 
                    1. Create email send api
                */
            const response: types.ApiResponse = {
                message: ApiResponseMessages.PASSWORD_RESET_LINK_SENT, status: types.ApiStatusConstant.SUCCESS, data: {}
            };

            const { email } = req.body;

            //validating the input first
            const validationResult = schemas.passwordReset.validate(req.body);
            if (validationResult.error) {
                loggerG.error(ApiNamesConstants.SEND_PASSWORD_RESET_LINK, validationResult);
                response["status"] = types.ApiStatusConstant.FAILED;
                response["message"] = { error: validationResult }
                return res.status(400).json(response);
            }

            //check if user has already signedup or not, if yes then we cannot signup again
            const db: mongoDB.Db = await Database.get();
            const query = { email };
            const user = await db.collection(DbConstants.PANEL_USERS_COLLECTION).findOne(query);
            loggerG.info(ApiNamesConstants.SEND_PASSWORD_RESET_LINK, { db: user })
            const iStatus: types.iStatus = user ? user!.iStatus : types.UserInvitedStatus.NONE;
            if (!user) {
                response["message"] = ApiResponseMessages.USER_NOT_INVITED;
                response["status"] = types.ApiStatusConstant.FAILED
                loggerG.info(ApiNamesConstants.SEND_PASSWORD_RESET_LINK, { message: ApiResponseMessages.USER_NOT_INVITED });
            } else if (iStatus === types.UserInvitedStatus.INVITED) {
                response["message"] = ApiResponseMessages.USER_NOT_SIGNEDUP;
                response["status"] = types.ApiStatusConstant.FAILED
                loggerG.info(ApiNamesConstants.SEND_PASSWORD_RESET_LINK, { message: ApiResponseMessages.USER_NOT_SIGNEDUP });
            } else if (iStatus === types.UserInvitedStatus.ACCEPTED) {
                await userServices.passwordResetEmail(email)
                loggerG.info(ApiNamesConstants.SEND_PASSWORD_RESET_LINK, { message: ApiResponseMessages.PASSWORD_RESET_LINK_SENT });
            }

            return res.status(200).json(response);
        } catch (ex) {
            loggerG.error(ApiNamesConstants.SEND_PASSWORD_RESET_LINK, ex);
            const response: types.ApiResponse = {
                message: { error: ex }, status: types.ApiStatusConstant.FAILED, data: {}
            };

            return res.status(400).json(response);
        }
    };


    export const passwordResetController: RequestHandler = async (req, res, next) => {
        loggerG.info(ApiNamesConstants.PASSWORD_RESET);
        try {
            /*
                    TODO: 
                    1. Create email send api
                */
            const response: types.ApiResponse = {
                message: ApiResponseMessages.PASSWORD_RESET, status: types.ApiStatusConstant.SUCCESS, data: {}
            };

            const email = req.reqEmail;
            const { password } = req.body;
            //validating the input first
            const validationResult = schemas.normalSignupValidation.validate(req.body);
            if (validationResult.error) {
                loggerG.error(ApiNamesConstants.PASSWORD_RESET, validationResult);
                response["status"] = types.ApiStatusConstant.FAILED;
                response["message"] = { error: validationResult }
                return res.status(400).json(response);
            }

            //check if user has already signedup or not, if yes then we cannot signup again
            const db: mongoDB.Db = await Database.get();
            const query = { email };
            const user = await db.collection(DbConstants.PANEL_USERS_COLLECTION).findOne(query);
            loggerG.info(ApiNamesConstants.PASSWORD_RESET, { db: user })
            const iStatus: types.iStatus = user ? user!.iStatus : types.UserInvitedStatus.NONE;
            if (iStatus === types.UserInvitedStatus.ACCEPTED) {
                const query = { email };
                console.log(`password `, password)
                const hashedPassword = await bcrypt.hash(password, SALTROUNDS)
                const update = { $set: { password: hashedPassword } }
                await db.collection(DbConstants.PANEL_USERS_COLLECTION).findOneAndUpdate(query, update);
                loggerG.info(ApiNamesConstants.PASSWORD_RESET, { message: ApiResponseMessages.PASSWORD_RESET });
            } else if (!user) {
                response["message"] = ApiResponseMessages.USER_NOT_INVITED;
                response["status"] = types.ApiStatusConstant.FAILED
                loggerG.info(ApiNamesConstants.PASSWORD_RESET, { message: ApiResponseMessages.USER_NOT_INVITED });
            } else if (iStatus === types.UserInvitedStatus.INVITED) {
                response["message"] = ApiResponseMessages.USER_NOT_SIGNEDUP;
                response["status"] = types.ApiStatusConstant.FAILED
                loggerG.info(ApiNamesConstants.PASSWORD_RESET, { message: ApiResponseMessages.USER_NOT_SIGNEDUP });
            }

            return res.status(200).json(response);
        } catch (ex) {
            loggerG.error(ApiNamesConstants.PASSWORD_RESET, ex);
            const response: types.ApiResponse = {
                message: { error: ex }, status: types.ApiStatusConstant.FAILED, data: {}
            };

            return res.status(400).json(response);
        }
    };

    export const normalLoginController: RequestHandler = async (req, res, next) => {
        loggerG.info(ApiNamesConstants.NORMAL_LOGIN);
        try {
            /*
                    TODO: 
                    1. Create email send api
                */
            const response: types.ApiResponse = {
                message: ApiResponseMessages.LOGIN_SUCCESSFUL, status: types.ApiStatusConstant.SUCCESS, data: {}
            };

            //validating the input first
            const validationResult = schemas.normalLoginValidation.validate(req.body);
            if (validationResult.error) {
                loggerG.error(ApiNamesConstants.NORMAL_LOGIN, validationResult);
                response["status"] = types.ApiStatusConstant.FAILED;
                response["message"] = { error: validationResult }
                return res.status(400).json(response);
            }

            const { email, password } = req.body;

            const db: mongoDB.Db = await Database.get();
            const query = { email };
            const projection = { iStatus: 1, password: 1 }
            const user = await db.collection(DbConstants.PANEL_USERS_COLLECTION).findOne(query, { projection });
            loggerG.info(ApiNamesConstants.NORMAL_LOGIN, { db: user })
            const iStatus: types.iStatus = user ? user!.iStatus : types.UserInvitedStatus.NONE;
            if (!user) {
                response["message"] = ApiResponseMessages.USER_NOT_INVITED;
                response["status"] = types.ApiStatusConstant.FAILED
                loggerG.info(ApiNamesConstants.NORMAL_LOGIN, { message: ApiResponseMessages.USER_NOT_INVITED });
            } else if (iStatus === types.UserInvitedStatus.INVITED) {
                response["message"] = ApiResponseMessages.USER_NOT_SIGNEDUP;
                response["status"] = types.ApiStatusConstant.FAILED
                loggerG.info(ApiNamesConstants.NORMAL_LOGIN, { message: ApiResponseMessages.USER_NOT_SIGNEDUP });
            } else if (iStatus === types.UserInvitedStatus.ACCEPTED) {
                const dbpassword = user?.password;
                const status = await bcrypt.compare(password, dbpassword);
                loggerG.info(ApiNamesConstants.NORMAL_LOGIN, { passwordMatchStatus: status });
                if (!status) {
                    response["message"] = ApiResponseMessages.LOGIN_UNSUCCESSFUL;
                    response["status"] = types.ApiStatusConstant.FAILED
                } else {
                    const token = await tokenServices.signToken({ email });
                    response["data"] = { token }
                }
            }
            return res.status(200).json(response);
        } catch (ex) {
            loggerG.error(ApiNamesConstants.NORMAL_LOGIN, { error: ex });
            const response: types.ApiResponse = {
                message: { error: ex }, status: types.ApiStatusConstant.FAILED, data: {}
            };

            return res.status(400).json(response);
        }
    };
}

export default userControllerServices