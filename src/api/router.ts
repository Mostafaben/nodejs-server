import express from 'express';
import AuthenticationController from './controllers/authentication_controller';

const router = express.Router();

router.use('/auth', AuthenticationController);

export default router;
