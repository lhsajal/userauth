import { RoleAndPermissions } from '../../src/customTypes/allTypes';
import winston from 'winston';


declare module 'express-serve-static-core' {
    interface Request {
        rnP?: RoleAndPermissions;
        reqEmail?: string
    }
}