import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UserModel from '../../models/user';
import { handleHttpError } from '../../utils/HttpResponseHandler';
import * as bcrypt from 'bcrypt';
import { ROLE } from '../../enum/enum';
import IPayload from '../../interfaces/payload';
import {
  generateRefreshToken,
  generateToken,
} from '../../utils/tokens_handlers';
import {
  authenticateUser,
  loginValidation,
  refreshTokenValidation,
  registerValidation,
} from '../middlewars/authentication';
import { validateRequest } from '../../utils/validations';

const router = express.Router();

router.post('/login', loginValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    validateRequest(errors, res);

    const { password, email } = req.body;
    const user: any = await UserModel.findOne({ email }).exec();

    if (!user || !bcrypt.compareSync(password, user.password))
      handleHttpError(new Error('wrong email or password'), res, 404);

    const payload: IPayload = { role: user.role, _id: user._id };
    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).send({
      data: {
        token,
        refreshToken,
      },
    });
  } catch (error) {
    handleHttpError(error, res, 500);
  }
});

router.post(
  '/register',
  registerValidation,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      validateRequest(errors, res);

      const { email, password, fullName } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user: any = new UserModel({
        email,
        fullName,
        password: hashedPassword,
      });

      await user.save();

      const payload: IPayload = { role: user.role, _id: user._id };
      const token = generateToken(payload);
      const refreshToken = generateRefreshToken(payload);

      user.refreshToken = refreshToken;
      await user.save();

      return res.status(201).send({
        data: {
          token,
          refreshToken,
        },
      });
    } catch (error) {
      handleHttpError(error, res, 500);
    }
  }
);

router.post('/refresh-token', refreshTokenValidation, (req, res) => {
  try {
    const errors = validationResult(req);
    validateRequest(errors, res);
    const { refreshToken } = req.body;
    const user: any = UserModel.findOne({ refreshToken }).exec();
    if (!user)
      return handleHttpError(new Error('non valid refresh token'), res, 404);

    const accessToken = generateToken({ _id: user._id, role: user.role });

    res.status(200).send({
      data: {
        accessToken,
      },
    });
  } catch (error) {
    handleHttpError(error, res, 500);
  }
});

router.get('/logout', authenticateUser, async (req: any, res: Response) => {
  try {
    const { _id } = req.user;

    const user: any = await UserModel.findById(_id).exec();
    user.refreshToken = null;
    await user.save();

    res.status(200).send({
      data: {
        message: 'successfully logout',
      },
    });
  } catch (error) {
    handleHttpError(error, res, 500);
  }
});

export default router;
