import { Router } from 'express'
const router = Router();
import userControllerServices from '../controllers/user';
import tokenServices from '../middlewares/tokenService';
import RolesAndPermissionsHandler from '../middlewares/roleAndPermissions';



router.post('/inviteUser', tokenServices.verifyToken, RolesAndPermissionsHandler, userControllerServices.inviteUser);
router.get('/verify-invite-token', tokenServices.verifyToken, userControllerServices.verifyTokenController);
router.post('/signup/normal', tokenServices.verifyToken, userControllerServices.normalSignupController);
router.post('/send-password-reset', userControllerServices.passwordResetEmailSendController);
router.post('/password-reset', tokenServices.verifyToken, userControllerServices.passwordResetController);
router.post('/normal-login', userControllerServices.normalLoginController);

//router.get('/normalLogin', normalLoginController);

router.get('/generate-token', tokenServices.signToken);

export default router;