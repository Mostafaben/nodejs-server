import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { handleHttpError } from '../../utils/HttpResponseHandler';
import jwt from 'jsonwebtoken';
import { tokenSecret } from '../../config/enviroment';

export const registerValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('passowrdConfirmation').custom((passwordConfirmation, { req }) => {
    if (passwordConfirmation != req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  body('fullName').notEmpty().isLength({ min: 4 }),
];

export const refreshTokenValidation = body('refreshToken').notEmpty();

export function authenticateUser(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split('')[1];
    if (!token) return handleHttpError(new Error('non authorized'), res, 403);
    jwt.verify(token, tokenSecret, (err: any, user: any) => {
      if (err) return handleHttpError(new Error('expired token'), res, 401);
      req.user = user;
      return next();
    });
  } catch (error) {
    handleHttpError(error, res, 500);
  }
}

export const loginValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
];
