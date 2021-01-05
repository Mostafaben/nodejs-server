import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { handleHttpError } from '../../utils/HttpResponseHandler';
import jwt from 'jsonwebtoken';
import { refreshTokenSecret, tokenSecret } from '../../config/enviroment';
import UserModel from '../../models/user';
import { ROLE, STATUS } from '../../enum/enum';
import IPayload from '../../interfaces/payload';

export const registerValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('passowrdConfirmation').custom((passwordConfirmation, { req }) => {
    if (passwordConfirmation !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  body('fullName').notEmpty().isLength({ min: 4 }),
];

export const loginValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
];
export const refreshTokenValidation = body('refreshToken').notEmpty();

export function authenticateUser(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return handleHttpError(new Error('non authorized'), res, 403);
    jwt.verify(token, tokenSecret, async (err: any, user: any) => {
      if (err) return handleHttpError(new Error('expired token'), res, 401);

      // check if user is not archived
      const userDocument: any = await UserModel.findById(user._id).exec();
      if (userDocument.status == STATUS.ARCHIVED)
        return handleHttpError(new Error('user was not found'), res, 404);

      req.user = user;
      return next();
    });
  } catch (error) {
    handleHttpError(error, res, 500);
  }
}

export function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return handleHttpError(new Error('not authorized'), res, 403);

    jwt.verify(
      token,
      refreshTokenSecret,
      (error: any, user: IPayload | any) => {
        if (error) return handleHttpError(new Error('token expired'), res, 401);
        if (user.role != ROLE.ADMIN)
          return handleHttpError(new Error('non authorized'), res, 403);
        return next();
      }
    );
  } catch (error) {
    handleHttpError(error, res, 400);
  }
}
