import {
  refreshTokenSecret,
  tokenDuration,
  tokenSecret,
} from '../config/enviroment';
import IPayload from '../interfaces/payload';
import jwt from 'jsonwebtoken';

export function generateToken(user: IPayload): string {
  return jwt.sign(user, tokenSecret, { expiresIn: `${tokenDuration}s` });
}
export function generateRefreshToken(user: IPayload): string {
  return jwt.sign(user, refreshTokenSecret);
}
