import { body } from 'express-validator';

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

export const loginValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
];
