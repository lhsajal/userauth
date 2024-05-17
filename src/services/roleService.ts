import { RoleAndPermissions } from '../customTypes/allTypes';

module.exports = {
    checkPermissions: async (permissions: RoleAndPermissions, op: string): Promise<boolean> => {
        //check here if the user has permission to do this operation.
        return true;
    }
}