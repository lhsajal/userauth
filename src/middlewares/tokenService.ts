import { Request, Response, NextFunction } from 'express';
import { ApiResponse, ApiStatusConstant } from '../customTypes/allTypes';
import { ApiResponseMessages } from '../util/apiResponseConstants';
import { ApiNamesConstants } from '../util/apiNamesConstants'
import jwt from 'jsonwebtoken';

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    //verify token
    try {
        let token = null;
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            // Check if the header starts with 'Bearer '
            token = authHeader.split(' ')[1];
        }
        const legit: jwt.JwtPayload | string = jwt.verify(token!, process.env.TOKEN_PUBLIC_KEY!);
        console.log(`legit `, legit)
        if (legit && typeof legit === 'object') {
            var { email } = legit;
        }
        req.reqEmail = email;
        loggerG.info(ApiNamesConstants.TOKEN_VERIFY, { email })
        next();
    } catch (ex) {
        loggerG.error(ApiNamesConstants.TOKEN_VERIFY, ex)
        const response: ApiResponse = {
            message: ex!, status: ApiStatusConstant.FAILED, data: {}
        };
        return res.status(401).send(response);
    }
}

export async function signToken(req: Request, res: Response, next: NextFunction) {
    // Token signing options
    const signOptions: jwt.SignOptions = {
        issuer: "Lhforce",
        subject: "Token for Invited User Signup",
        audience: "https://labourhomegroup.com/",
        expiresIn: process.env.SIGNIN_TOKEN_EXPIRE_TIME,
        algorithm: "RS256"
    };

    //console.log(process.env.TOKEN_PRIVATE_KEY)
    const token = jwt.sign({ email: "sajal.jain@labourhomeindia.com" }, process.env.TOKEN_PRIVATE_KEY!, signOptions);
    console.log("Token :" + token);
    loggerG.info(ApiNamesConstants.TOKEN_SIGN_FOR_INVITED_USESR, token);

    return res.status(200).json({ token });
}

export async function getToken(payload: object) {
    // Token signing options
    const signOptions: jwt.SignOptions = {
        issuer: "Lhforce",
        subject: "Token for Invited User Signup",
        audience: "https://labourhomegroup.com/",
        expiresIn: process.env.SIGNUP_TOKEN_EXPIRE_TIME,
        algorithm: "RS256"
    };
    const token = jwt.sign(payload, process.env.TOKEN_PRIVATE_KEY!, signOptions);
    loggerG.info(ApiNamesConstants.TOKEN_SIGN_FOR_INVITED_USESR, token);
    return token
}