import dotenv from 'dotenv';
dotenv.config();

/**
 * @note
 * we need this file to organize our imports
 *
 */

const port = process.env.PORT;
const host = process.env.HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_Name;
const dbHost = process.env.DB_HOST;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || '';
const tokenSecret: string = process.env.TOKEN_SECRET || '';
const serverUrl = `https://${host}:${port}/`;
const userImageRoute = `${serverUrl}/public/user-image/`;
const tokenDuration = process.env.TOKEN_DURATION;

/**
 * @todo
 * add your SMTP server configuration
 */
const mailHost = process.env.MAIL_HOST || '';
const mailPort = process.env.MAIL_PORT || '';
const mailUser = process.env.MAIL_USER || '';
const mailPass = process.env.MAIL_PASS || '';

export {
  port,
  dbName,
  dbPort,
  dbHost,
  refreshTokenSecret,
  tokenSecret,
  mailHost,
  mailUser,
  mailPass,
  userImageRoute,
  mailPort,
  tokenDuration,
  serverUrl,
};
