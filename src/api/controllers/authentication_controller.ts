import * as bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ROLE, STATUS } from '../../enum/enum';
import IPayload from '../../interfaces/payload';
import UserModel from '../../models/user';
import { handleHttpError } from '../../utils/HttpResponseHandler';
import {
  generateRefreshToken,
  generateToken,
} from '../../utils/tokens_handlers';
import { validateRequest } from '../../utils/validations';
import {
  authenticateUser,
  loginValidation,
  refreshTokenValidation,
  registerValidation,
} from '../middlewars/authentication';

const router = express.Router();

router.post('/login', loginValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    validateRequest(errors, res);

    const { password, email } = req.body;
    const user: any = await UserModel.findOne({ email }).exec();

    if (!user || !bcrypt.compareSync(password, user.password))
      return handleHttpError(new Error('wrong email or password'), res, 404);

    /**
     *
     * check if the user is blocked by the admin
     *
     */

    if (user.status == STATUS.ARCHIVED)
      return handleHttpError(new Error('user was not found'), res, 404);

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

      const payload: IPayload = { role: ROLE.USER, _id: user._id };
      const token: string = generateToken(payload);
      const refreshToken: string = generateRefreshToken(payload);

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

    /**
     *
     * @description
     * here you can add expiring date to your refresh token and validate it before you
     * generate a refresh token
     *
     */
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

/**
 * @description
 * to logout you need to be logged in in this case the user has to be authenticated first
 *
 */
router.get('/logout', authenticateUser, async (req: any, res: Response) => {
  try {
    const { _id } = req.user;
    await UserModel.findByIdAndUpdate(_id, { refreshToken: null });
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
