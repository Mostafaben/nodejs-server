import { refreshTokenSecret, tokenSecret } from '../config/enviroment';
import IPayload from '../interfaces/payload';
import jwt from 'jsonwebtoken';

export function generateToken(user: IPayload): string {
  const token = jwt.sign(user, tokenSecret, { expiresIn: '3600s' });
  return token;
}
export function generateRefreshToken(user: any): string {
  const refreshToken = jwt.sign(user, refreshTokenSecret, {
    expiresIn: '3600s',
  });
  return refreshToken;
}
