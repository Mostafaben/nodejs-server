import express from 'express';
import AuthenticationController from './controllers/authentication_controller';
import adminUsersController from './controllers/users_controller';
import {
  authenticateAdmin,
  authenticateUser,
} from './middlewars/authentication';
import userController from './controllers/user_controller';
import publicController from './controllers/public_controller';
const router = express.Router();

router.use('/auth', AuthenticationController);
router.use('/users', authenticateAdmin, adminUsersController);
router.use('/user', authenticateUser, userController);
router.use('/public', publicController);

export default router;
