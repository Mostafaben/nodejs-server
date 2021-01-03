import express from 'express';
import AuthenticationController from './controllers/authentication_controller';
import adminUsersController from './controllers/users_controller';
import { authenticateAdmin } from './middlewars/authentication';
const router = express.Router();

router.use('/auth', AuthenticationController);
router.use('/users', authenticateAdmin, adminUsersController);

export default router;
