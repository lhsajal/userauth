import { Router } from 'express'
const router = Router();
import { inviteUser, verifyTokenController, normalSignupController, passwordResetEmailSendController, passwordResetController, normalLoginController } from '../controllers/user';
import {verifyToken, signToken}  from '../middlewares/tokenService';
import RolesAndPermissionsHandler from '../middlewares/roleAndPermissions';



router.post('/inviteUser', verifyToken, RolesAndPermissionsHandler, inviteUser);
router.get('/verify-invite-token', verifyToken, verifyTokenController);
router.post('/signup/normal', verifyToken, normalSignupController);
router.post('/send-password-reset', passwordResetEmailSendController);
router.post('/password-reset', verifyToken, passwordResetController);
router.post('/normal-login', normalLoginController);

//router.get('/normalLogin', normalLoginController);

router.get('/generate-token', signToken);

export default router;