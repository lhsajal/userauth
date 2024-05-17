import {RoleAndPermissions} from '../customTypes/allTypes';
import { RequestHandler } from 'express';
import { ApiNamesConstants } from '../util/apiNamesConstants'

export const FetchRoleAndPermissions = async (email: string) : Promise<RoleAndPermissions>  => {
    loggerG.info(ApiNamesConstants.FETCH_ROLES_PERMISSIONS, { email })
    console.log(`email `, email)
    //fetch roles and permissions
    const rnP: RoleAndPermissions = {
        role: {
            id: "",
            type: "",
            name: ""
        },
        permissions: []
    }
    return rnP;
};

const RolesAndPermissionsHandler: RequestHandler = async(req, res, next)   => {
    //fetch roles and permissions
    const rnP: RoleAndPermissions = await FetchRoleAndPermissions(req.reqEmail!);
    req.rnP = rnP
    next();
}

export default RolesAndPermissionsHandler;