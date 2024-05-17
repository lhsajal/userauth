import { Request, Response, NextFunction } from 'express';

export type errorHandler = {
    err: Error;
    req: Request;
    res: Response;
    next: NextFunction;
};


export enum ApiStatusConstant {
    FAILED = "failed",
    SUCCESS = "success"
}

type ApiStatus = ApiStatusConstant.FAILED | ApiStatusConstant.SUCCESS;

export type ApiResponse = {
    message: string|Object;
    status: ApiStatus;
    data: object;
}

export interface Role {
    id: string;
    type: string;
    name: string;
}

export interface RoleAndPermissions {
    role: Role;
    permissions: object[]; 
}

type status = true | false

export interface TokenVerificationReturn {
    status: status;
    email: string;
} 

export enum UserInvitedStatus {
    INVITED,
    ACCEPTED,
    NONE
}

export type iStatus = UserInvitedStatus.INVITED | UserInvitedStatus.ACCEPTED | UserInvitedStatus.NONE
